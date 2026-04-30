@echo off
title VoteGuide Servers
echo Starting VoteGuide Servers...

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node index.js"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows.

echo Opening app in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173

