#!/usr/bin/env python3
import json, os, re, subprocess, sys, shutil
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image

root = Path(sys.argv[1]); out = Path(sys.argv[2]); pages_dir = out / "pages"; pages_dir.mkdir(parents=True, exist_ok=True)
source_dir = root / "source-pdfs"
files = ["DP-700N1.pdf", "DP-700N2.pdf", "DP-700N3.pdf"]
rows = []
for source in files:
    pdf = source_dir / source
    xml_path = out / f"{source}.xml"
    with xml_path.open("wb") as fh:
        subprocess.run(["pdftotext", "-bbox-layout", str(pdf), "-"], stdout=fh, check=True)
    tree = ET.parse(xml_path)
    starts = []
    for page_no, page in enumerate(tree.findall(".//{*}page"), 1):
        words = list(page.iterfind(".//{*}word"))
        for i, word in enumerate(words[:-1]):
            text = "".join(word.itertext()).strip().upper()
            nxt = "".join(words[i+1].itertext()).strip()
            if text.rstrip(":") in ("QUESTION", "QUESTION:") and re.fullmatch(r"\d+", nxt):
                starts.append({"question": int(nxt), "page": page_no, "y": float(word.attrib["yMin"]), "page_w": float(page.attrib["width"]), "page_h": float(page.attrib["height"])})
    # Keep the first actual occurrence of each source question.
    unique = {}
    for item in starts: unique.setdefault(item["question"], item)
    starts = sorted(unique.values(), key=lambda x: (x["page"], x["y"], x["question"]))
    if not starts: raise RuntimeError(f"No question boundaries detected in {source}")
    pages = {}
    for item in starts: pages.setdefault(item["page"], []).append(item)
    for i, item in enumerate(starts):
        next_item = starts[i+1] if i + 1 < len(starts) else None
        source_pages = list(range(item["page"], (next_item["page"] + 1 if next_item else max(pages) + 1)))
        # If the next question is on the same page, it is still one-page; otherwise include every continuation page.
        if next_item and next_item["page"] == item["page"]: source_pages = [item["page"]]
        slug = f"dp700-n{re.search(r'N(\d)', source).group(1)}-q{item['question']:03d}"
        qdir = root / "assets" / "questions" / slug; qdir.mkdir(parents=True, exist_ok=True)
        parts = []
        for page_no in source_pages:
            page_png = pages_dir / f"{source}-p{page_no}.png"
            if not page_png.exists():
                subprocess.run(["pdftoppm", "-f", str(page_no), "-l", str(page_no), "-r", "120", "-png", "-singlefile", str(pdf), str(page_png.with_suffix(""))], check=True, stdout=subprocess.DEVNULL)
            im = Image.open(page_png).convert("RGB")
            scale = im.width / item["page_w"]
            top = max(0, round(item["y"] * scale) - 10) if page_no == item["page"] else 0
            bottom = im.height
            if next_item and page_no == next_item["page"]:
                bottom = min(im.height, round(next_item["y"] * scale) - 10)
            if bottom <= top: bottom = im.height
            crop = im.crop((0, top, im.width, bottom))
            part_name = f"part-{len(parts)+1:02d}.png"; crop.save(qdir / part_name, "PNG", optimize=True); parts.append(part_name)
        images = [Image.open(qdir / p).convert("RGB") for p in parts]
        canvas = Image.new("RGB", (max(im.width for im in images), sum(im.height for im in images)), "white")
        y = 0
        for im in images: canvas.paste(im, (0, y)); y += im.height
        canvas.save(qdir / "full.png", "PNG", optimize=True)
        rows.append({"sourceFile": source, "sourceQuestion": item["question"], "sourcePages": source_pages, "slug": slug, "parts": [f"part-{j+1:02d}.png" for j in range(len(parts))]})
# Canonical source order, independent of filesystem order.
rows.sort(key=lambda r: (files.index(r["sourceFile"]), r["sourcePages"][0], r["sourceQuestion"]))
(out / "boundaries.json").write_text(json.dumps(rows, indent=2) + "\n")
print(json.dumps({"questions": len(rows), "multiPage": sum(len(r["sourcePages"]) > 1 for r in rows)}, indent=2))
