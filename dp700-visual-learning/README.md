# DP-700 Visual Learning & Interactive Study Simulator

[![DP-700](https://img.shields.io/badge/Microsoft-DP--700-2563EB?style=for-the-badge&logo=microsoft)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700)
[![Original Questions](https://img.shields.io/badge/Original%20Questions-100-10B981?style=for-the-badge)](./data/questions.js)
[![Validated Report](https://img.shields.io/badge/DUMP%20Report-118-F59E0B?style=for-the-badge)](./data/dump.js)
[![Interactive Types](https://img.shields.io/badge/DUMP-Choice%20%7C%20Drag%20%26%20Drop%20%7C%20Hotspot-FB7185?style=for-the-badge)](./data/dump-interactions.js)
[![GitHub Pages](https://img.shields.io/badge/Ready%20for-GitHub%20Pages-111827?style=for-the-badge&logo=github)](https://pages.github.com/)

A fully static, English-language visual learning and simulation site for Microsoft DP-700. It is ready for GitHub Pages and requires no backend, database, package installation, or build step.

## Included features

- English-only, responsive LTR interface with dark and light themes.
- Dashboard for completion, accuracy, errors, bookmarks, and study streak.
- 19 visual lessons with memory hooks, diagrams, code snapshots, exact video chapter links, 60-second checks, exam traps, and official references.
- 100 original practice questions with instant feedback.
- 40-question, 45-minute exam simulator with flags and free navigation.
- 10-question Quick Quiz, Smart Review, bookmarks, and flashcards.
- Five-day study plan, cheat sheet, tool comparison, and decision tree.
- Performance analytics with the latest 30 completed sessions.
- Progress stored in `localStorage`, including JSON export and import.
- PWA/offline app-shell cache after the first hosted visit.

### Separate interactive DUMP section

The supplied `DP-700_Validated_Question_Report.docx` was imported as a separate DUMP library containing:

- 118 complete question records across five batches.
- Original supplied answer and independently validated answer.
- 88 supplied selections validated as correct.
- 30 supplied selections corrected.
- Detailed explanation and DP-700 concept area for every question.
- 14 ambiguity, outdated behavior, or invalid-option notes.
- 50 mapped Microsoft Learn and Azure documentation references.
- Exact source wording plus extracted PDF exhibits for questions that depend on tables, code, or answer-area visuals.
- 74 single-choice, 9 multiple-choice, 9 Drag & Drop, 20 dropdown Hotspot, and 6 Yes/No Hotspot interactions.
- Interactive answer checking against the corrected validation report, not the answer printed in the source dump.
- Five deliberately unscored items (53, 56, 89, 100, and 103) where the original choices are invalid, incomplete, or underspecified.
- Five source-order DUMP runs, one full 118-question run, randomized 25-question runs, a question palette, search/filter tools, and Mastered/Review tracking.
- The DUMP landing page is an exam launcher—not an answer report. Corrected answers and explanations remain hidden until the learner submits each interaction.

### Independent IMPORTANT section

The supplied `DP700_Practice_Exam.html` is included unchanged in purpose as a separate 93-question simulator with its own runs, grading, question editor, progress, and backup controls. Its progress is isolated from the validated DUMP bank.

Product behavior can change. The linked Microsoft source remains the current authority.

## Run locally

```powershell
cd "C:\path\to\dp700-visual-learning"
py -m http.server 8080
Start-Process "http://localhost:8080"
```

The site can be opened directly through `index.html`, but the service worker requires HTTP or HTTPS.

## Publish with the included PowerShell script

Create an empty public GitHub repository first. Then run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\publish-to-github.ps1 -GitHubUser "YOUR_GITHUB_USERNAME" -Repository "dp700"
```

For the `Fatoomnoour` account:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\publish-to-github.ps1 -GitHubUser "Fatoomnoour" -Repository "dp700"
```

After pushing, open repository **Settings → Pages**, select **Deploy from a branch**, then choose `main` and `/(root)`.

The expected URL is:

```text
https://fatoomnoour.github.io/dp700/
```

## Update an existing repository from CMD

```cmd
git add .
git commit -m "Add interactive DUMP types and IMPORTANT practice bank"
git push origin main
```

## Live-site badge

```markdown
[![Live DP-700 Simulator](https://img.shields.io/badge/Live-DP--700%20Simulator-2563EB?style=for-the-badge&logo=github)](https://fatoomnoour.github.io/dp700/)
```

## Project structure

```text
dp700-visual-learning/
├── index.html
├── data/
│   ├── questions.js
│   ├── dump.js
│   ├── dump-interactions.js
│   └── visual-lessons.js
├── assets/
│   ├── css/styles.css
│   ├── js/app.js
│   ├── dump/                  # extracted source exhibits
│   └── icon.svg
├── important/
│   └── DP700_Practice_Exam.html
├── manifest.webmanifest
├── sw.js
├── publish-to-github.ps1
├── .nojekyll
└── README.md
```

## Privacy

Progress stays in the learner's browser and is not transmitted to a server. The application has no login, analytics tracker, or backend.
