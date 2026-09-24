@echo off
setlocal
where docker >nul 2>nul
if %errorlevel%==0 (
  echo Starting PostgreSQL in Docker...
  docker compose up -d db
) else (
  echo Docker not found. Make sure PostgreSQL is running and server\.env has correct DB settings.
)
echo Installing dependencies...
call npm install
if errorlevel 1 goto :error
echo Seeding database...
call npm run db:seed
if errorlevel 1 goto :error
echo Starting client and server...
call npm run dev
exit /b 0
:error
echo.
echo Startup failed. See README_START_HERE.txt
pause
exit /b 1
