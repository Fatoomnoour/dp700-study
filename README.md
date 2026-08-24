# DP-700 Professional Mastery — v9

A fully static Microsoft DP-700 learning and exam-preparation website built with HTML, CSS, Vanilla JavaScript, `localStorage`, and a PWA service worker. It remains compatible with direct GitHub Pages hosting and requires no backend, npm installation, or build step.

## v9 professional-learning system

Version 9 extends the existing v8 course without changing the protected Practice, DUMP, or IMPORTANT question banks.

- 15 existing course modules and all 213 existing lesson activities remain in their original order.
- Every activity continues to open as a complete bilingual lesson.
- Foundation diagnostic with 18 questions and skill-area results.
- Seven-block prerequisite bootcamp covering SQL, Python, Spark, KQL, data engineering, Fabric, and Git.
- Four learning-depth modes inside every lesson:
  - Foundation
  - Exam Level
  - Professional Level
  - Deep Dive
- Topic Mastery Gate inside every lesson.
- Module Mastery Dashboard with five evidence levels:
  - Not Started
  - Studied
  - Practiced
  - Exam Ready
  - Professionally Mastered
- 15 independent module Challenge Labs.
- 8 broken-solution Troubleshooting Labs.
- 12-scenario Fabric Decision Simulator.
- 15 module assessments containing 75 new original scenario questions.
- Three complete portfolio projects:
  - Batch Data Engineering Platform
  - Enterprise Fabric Warehouse
  - Real-Time Intelligence Platform
- Separate `localStorage` namespace: `dp700-professional-path-v9`.
- v9 progress is included in progress export/import.

## Protected existing content

This update does not replace or edit:

- `data/questions.js` — original Practice bank.
- `data/dump.js` — validated 118-question DUMP bank.
- `data/dump-interactions.js` — DUMP interaction definitions.
- `assets/dump/` — DUMP exhibits.
- `important/DP700_Practice_Exam.html` — independent 93-question IMPORTANT simulator.

Existing IDs, answers, ordering, scoring behavior, and saved progress remain unchanged.

## Files added or changed by v9

```text
index.html
manifest.webmanifest
sw.js
README.md
assets/css/styles.css
assets/js/app.js
data/course.js
data/course-content.js
data/arabic-lessons.js
data/professional-path.js       # new v9 learning data
UPDATE-V9.txt
VALIDATION-V9.txt
PUBLISH-V9-COMMANDS.txt
publish-v9.cmd
```

## Apply the patch

Extract the contents of the v9 ZIP directly over the existing repository root and allow Windows to replace matching files.

Then run:

```cmd
publish-v9.cmd
```

Or run manually:

```cmd
git status
git add index.html manifest.webmanifest sw.js README.md assets/css/styles.css assets/js/app.js data/course.js data/course-content.js data/arabic-lessons.js data/professional-path.js UPDATE-V9.txt VALIDATION-V9.txt PUBLISH-V9-COMMANDS.txt publish-v9.cmd
git commit -m "Add DP-700 professional mastery path, challenges and projects (v9)"
git push origin main
```

After GitHub Pages finishes deploying, open:

```text
https://fatoomnoour.github.io/dp700/?v=9#professional
```

Use `Ctrl + F5` if the browser still displays the v8 cached version.

## Run locally

```cmd
cd C:\path\to\dp700-interactive
py -m http.server 8080
```

Then open:

```text
http://localhost:8080/?v=9#professional
```

## Privacy

All progress remains in the learner's browser. The application has no login, backend, or analytics tracker.

## Uploaded question coverage

The standalone site is based on the uploaded DP-700N1, DP-700N2, and DP-700N3 question sources. The validated bank contains the 118-question corrected review set, while the original practice bank contains 100 original scenario questions. Source-dependent items are rendered as interactive controls rather than static answer text whenever an interaction definition is available.

Supported simulations include single choice, multiple choice, Yes/No tables, dropdown hotspots, drag-and-drop hotspots with an accessible select fallback, source exhibits, answer checking, corrected-answer feedback, explanations, bookmarks, progress tracking, and review queues. Image-dependent questions use the exhibit assets under `assets/dump/`; questions whose source image or answer choices are incomplete are marked as unscored instead of silently assigning an unsupported answer.

The source of truth for current product behavior remains the linked Microsoft Learn references shown in the application. The uploaded PDFs are study material and are not official Microsoft exam content.
