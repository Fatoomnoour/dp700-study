#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const buildDir = path.join(root, "build", "dp700-rebuild");
const boundaryPath = path.join(buildDir, "boundaries.json");
fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

execFileSync("python3", [path.join(root, "scripts", "rebuild-dp700-images.py"), root, buildDir], { stdio: "inherit" });
const boundaries = JSON.parse(fs.readFileSync(boundaryPath, "utf8"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data/uploaded-pdf-bank.js"), "utf8"), context);
const bank = context.window.DP700_UPLOADED;
const index = new Map(boundaries.map(row => [`${row.sourceFile}:${row.sourceQuestion}`, row]));
let rebuilt = 0;
for (const q of bank.questions) {
  const row = index.get(`${q.sourceFile}:${q.sourceQuestion}`);
  if (!row) throw new Error(`No PDF boundary found for ${q.sourceFile} question ${q.sourceQuestion}`);
  q.sourcePages = row.sourcePages;
  q.sourcePage = row.sourcePages[0];
  q.questionScreenshot = `assets/questions/${row.slug}/full.png`;
  q.screenshotParts = row.parts.map(part => `assets/questions/${row.slug}/${part}`);
  rebuilt++;
}
const bankJson = JSON.stringify(bank);
fs.writeFileSync(path.join(root, "data/uploaded-pdf-bank.js"), `window.DP700_UPLOADED = ${bankJson};\n`);
const report = { questionsRebuilt: rebuilt, multiPageQuestions: boundaries.filter(row => row.sourcePages.length > 1).length, screenshots: rebuilt, sourcePages: boundaries.reduce((n, row) => n + row.sourcePages.length, 0) };
fs.writeFileSync(path.join(buildDir, "summary.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
