@echo off
cd /d "C:\Users\ngoil\Claude\Projects\Digital Marketing Agency\joz-agency"

echo Removing stale git lock if present...
if exist ".git\index.lock" del /f ".git\index.lock"

echo Adding all files...
git add .

echo Committing...
git commit -m "feat: Stages F1-F8 — complete agency frontend (Dashboard, Clients, Content, Ads, Memory, Reports, Settings)"

echo Checking remote...
git remote -v

echo Pushing...
git push origin main

echo.
echo Done! Check above for any errors.
pause
