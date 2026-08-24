@echo off
setlocal

echo.
echo DP-700 Professional Mastery v9 Publisher
echo ========================================
echo.

git status
if errorlevel 1 goto :error

git add index.html manifest.webmanifest sw.js README.md assets/css/styles.css assets/js/app.js data/course.js data/course-content.js data/arabic-lessons.js data/professional-path.js UPDATE-V9.txt VALIDATION-V9.txt PUBLISH-V9-COMMANDS.txt publish-v9.cmd
if errorlevel 1 goto :error

git commit -m "Add DP-700 professional mastery path, challenges and projects (v9)"
if errorlevel 1 (
  echo.
  echo Git did not create a commit. There may be no new changes, or Git needs your name/email configured.
  echo Review the message above before continuing.
  goto :end
)

git push origin main
if errorlevel 1 goto :error

echo.
echo Push completed successfully.
echo Open: https://fatoomnoour.github.io/dp700/?v=9#professional
echo Use Ctrl + F5 after GitHub Pages finishes deploying.
goto :end

:error
echo.
echo A Git command failed. Review the message above.

:end
pause
endlocal
