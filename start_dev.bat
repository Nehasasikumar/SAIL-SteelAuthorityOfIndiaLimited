@echo off
echo Starting RakeVision AI development environment...

:: Start the backend server in a new terminal
start powershell.exe -Command "cd %~dp0\backend && python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0"

:: Wait for backend to initialize
timeout /t 5

:: Start the frontend server in a new terminal
start powershell.exe -Command "cd %~dp0\frontend && npm run dev -- --port 5173"

echo RakeVision AI development environment started!
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:5173
echo - API Docs: http://localhost:8000/docs

echo.
echo Press any key to shut down both servers...
pause > nul

:: Kill processes (optional - user can close terminals manually)
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im python.exe > nul 2>&1

echo RakeVision AI development environment stopped.