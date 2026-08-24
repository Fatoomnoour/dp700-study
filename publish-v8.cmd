@echo off
setlocal

REM Run this file from the ROOT of the existing Fatoomnoour/dp700 repository
REM after extracting the v8 patch over the repository and replacing files.

echo.
echo [1/5] Checking repository...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo ERROR: This folder is not a Git repository.
  echo Open CMD inside your existing dp700 repository and run publish-v8.cmd again.
  exit /b 1
)

echo.
echo [2/5] Showing changed files...
git status --short

echo.
echo [3/5] Staging DP-700 v8 files...
git add index.html assets/css/styles.css assets/js/app.js data/course.js data/course-content.js sw.js manifest.webmanifest README.md UPDATE-V8.txt publish-v8.cmd
if errorlevel 1 exit /b 1

echo.
echo [4/5] Creating commit...
git commit -m "Upgrade all 213 DP-700 course activities to full lessons (v8)"
if errorlevel 1 (
  echo No new commit was created. Review git status above.
  exit /b 1
)

echo.
echo [5/5] Pushing to GitHub main...
git push origin main
if errorlevel 1 (
  echo Push failed. Confirm GitHub authentication and that the branch is main.
  exit /b 1
)

echo.
echo SUCCESS: v8 was pushed to GitHub.
echo GitHub Pages: https://fatoomnoour.github.io/dp700/
echo If the old version appears, hard-refresh with Ctrl+F5 because the PWA cache changed to v8.
endlocal
