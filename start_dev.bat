@echo off
echo Starting RakeVision AI development environment...

echo.
echo === NETWORK CHECK ===
:: Check if ports are already in use
echo Checking if ports are already in use...
netstat -ano | findstr ":8000" > nul
if %ERRORLEVEL% EQU 0 (
  echo WARNING: Port 8000 is already in use. Backend might fail to start.
)
netstat -ano | findstr ":5173" > nul
if %ERRORLEVEL% EQU 0 (
  echo WARNING: Port 5173 is already in use. Frontend might fail to start.
)

:: Start the backend server in a new terminal with debug logging
echo.
echo === STARTING BACKEND ===
start powershell.exe -Command "cd %~dp0\backend && python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0 --log-level debug"

:: Wait for backend to initialize
echo Waiting for backend to initialize (5 seconds)...
timeout /t 5

:: Start the frontend server in a new terminal
echo.
echo === STARTING FRONTEND ===
start powershell.exe -Command "cd %~dp0\frontend && npm run dev -- --port 5173"

echo.
echo === TROUBLESHOOTING TIPS ===
echo If you see WebSocket errors in the browser console:
echo 1. Check that backend is running (port 8000)
echo 2. Try opening http://localhost:8000/ directly in browser
echo 3. Uncomment VITE_WS_BASE_URL in frontend/.env to use direct connection
echo.

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