#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const bankPath = path.join(root, "data/uploaded-pdf-bank.js");
const interactionPath = path.join(root, "data/uploaded-interactions.js");
const manifestPath = path.join(root, "data/uploaded-manifest.json");
const reviewPath = path.join(root, "REVIEW_REQUIRED.md");

function loadWindow(file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window;
}
function fail(message) { errors.push(message); }
const errors = [];
const warnings = [];
const bank = loadWindow(bankPath).DP700_UPLOADED;
const interactions = loadWindow(interactionPath).DP700_UPLOADED_INTERACTIONS;
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const questions = bank.questions;
const fileOrder = ["DP-700N1.pdf", "DP-700N2.pdf", "DP-700N3.pdf"];
const sourceMaps = {};

for (const file of fileOrder) {
  const pdf = path.join(root, "source-pdfs", file);
  if (!fs.existsSync(pdf)) { fail(`${file}: source PDF is missing`); continue; }
  const text = execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" });
  const pages = text.split("\f");
  const map = new Map();
  pages.forEach((pageText, index) => {
    for (const match of pageText.matchAll(/(?:QUESTION|Question):\s*(\d+)/g)) {
      const n = Number(match[1]);
      if (!map.has(n)) map.set(n, index + 1);
    }
  });
  sourceMaps[file] = map;
}

if (manifest.total && manifest.total !== questions.length) fail(`Manifest total ${manifest.total} does not equal ${questions.length}`);
if (bank.meta?.questionCount !== questions.length) fail(`Bank meta count does not equal question count`);
const ids = new Set();
const seenSourceQuestions = new Map();
let previousKey = "";
const reviewRows = [];
const boundariesPath = path.join(root, "build", "dp700-rebuild", "boundaries.json");
const boundaries = fs.existsSync(boundariesPath) ? JSON.parse(fs.readFileSync(boundariesPath, "utf8")) : [];
const boundaryMap = new Map(boundaries.map(row => [`${row.sourceFile}:${row.sourceQuestion}`, row]));
for (const q of questions) {
  const key = `${fileOrder.indexOf(q.sourceFile)}:${String(q.sourcePage).padStart(4, "0")}:${String(q.sourceQuestion).padStart(4, "0")}`;
  if (ids.has(q.n)) fail(`Duplicate internal question id ${q.n}`);
  ids.add(q.n);
  if (previousKey && key < previousKey) fail(`Ordering regression before ${q.sourceFile} question ${q.sourceQuestion} (page ${q.sourcePage})`);
  previousKey = key;
  const sourceKey = `${q.sourceFile}:${q.sourceQuestion}`;
  if (seenSourceQuestions.has(sourceKey)) fail(`Duplicate source question ${sourceKey}`);
  seenSourceQuestions.set(sourceKey, q.n);
  if (!q.question?.trim()) fail(`${q.n}: missing question text`);
  if (!Array.isArray(q.options) || q.options.length < 1) fail(`${q.n}: missing answer choices`);
  const boundary = boundaryMap.get(`${q.sourceFile}:${q.sourceQuestion}`);
  if (!boundary) fail(`${q.n}: missing rebuilt PDF boundary`);
  if (!Array.isArray(q.sourcePages) || q.sourcePages.length < 1) fail(`${q.n}: missing sourcePages array`);
  if (boundary && JSON.stringify(q.sourcePages) !== JSON.stringify(boundary.sourcePages)) fail(`${q.n}: sourcePages do not match rebuilt boundary`);
  if (!q.questionScreenshot || !fs.existsSync(path.join(root, q.questionScreenshot))) fail(`${q.n}: missing complete question screenshot`);
  for (const part of q.screenshotParts || []) if (!fs.existsSync(path.join(root, part))) fail(`${q.n}: missing screenshot part ${part}`);
  const interaction = interactions[String(q.n)];
  if (!interaction) { fail(`${q.n}: missing interaction record`); continue; }
  const assets = interaction.assets || [];
  if (!assets.length) warnings.push(`${q.n}: no exhibit asset`);
  for (const asset of assets) if (!fs.existsSync(path.join(root, asset))) fail(`${q.n}: missing exhibit ${asset}`);
  for (const asset of assets) {
    const assetMatch = asset.match(/dp-700n([123])-q(\d+)/i);
    const fileMatch = q.sourceFile.match(/N([123])/i);
    if (assetMatch && fileMatch && (Number(assetMatch[1]) !== Number(fileMatch[1]) || Number(assetMatch[2]) !== Number(q.sourceQuestion))) {
      fail(`${q.n}: exhibit ${asset} is linked to a different source question`);
    }
  }
  if (interaction.unscored) reviewRows.push({ q, reason: "The source image/options are incomplete or not reliably machine-gradable; retained as review-only." });
  else if (!interaction.correctLabels?.length && !interaction.correct?.length && !interaction.slots?.length) fail(`${q.n}: missing validated answer`);
  const expectedPage = sourceMaps[q.sourceFile]?.get(Number(q.sourceQuestion));
  if (!expectedPage) warnings.push(`${q.n}: question ${q.sourceQuestion} was not detected by pdftotext in ${q.sourceFile}`);
  else if (Number(q.sourcePage) !== expectedPage) fail(`${q.n}: sourcePage ${q.sourcePage} disagrees with PDF page ${expectedPage}`);
}
for (const file of fileOrder) {
  const rows = questions.filter(q => q.sourceFile === file);
  const expected = manifest.counts?.[file.match(/N\d/)?.[0]];
  if (expected && rows.length !== expected) fail(`${file}: expected ${expected} questions, found ${rows.length}`);
  const nums = rows.map(q => Number(q.sourceQuestion)).sort((a,b)=>a-b);
  for (let i=1;i<=nums.length;i++) if (nums[i-1] !== i) fail(`${file}: missing source question ${i}`);
}
const review = ["# REVIEW_REQUIRED", "", "Questions retained for manual review because the source answer/exhibit is incomplete or not reliably gradable.", "", "| Internal ID | Source | PDF page | Reason |", "|---:|---|---:|---|"];
for (const row of reviewRows) review.push(`| ${row.q.n} | ${row.q.sourceFile} question ${row.q.sourceQuestion} | ${row.q.sourcePage} | ${row.reason} |`);
review.push("");
fs.writeFileSync(reviewPath, review.join("\n"));
const summary = { questions: questions.length, exhibits: questions.reduce((n,q)=>n+(interactions[String(q.n)]?.assets?.length||0),0), reviewRequired: reviewRows.length, errors, warnings };
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
