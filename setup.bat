@echo off
REM WMSU ILS Elementary Portal - Local Development Setup Script

echo =========================================
echo WMSU ILS Elementary Portal Setup
echo =========================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js version: %NODE_VERSION%
echo npm version: %NPM_VERSION%

REM Install root dependencies
echo.
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Create .env file from .env.example if it doesn't exist
if not exist ".env" (
    echo.
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please update .env with your database credentials
)

REM Create backend .env if it doesn't exist
if not exist "server\.env" (
    echo Creating server\.env file...
    copy .env.example server\.env
    echo WARNING: Please update server\.env with your database credentials
)

echo.
echo =========================================
echo Setup Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Update server\.env with your database credentials
echo 3. Start the backend: cd server && npm run dev
echo 4. In another terminal, start the frontend: npm run dev
echo 5. Open http://localhost:5173 in your browser
echo.
echo Default credentials:
echo   Username: admin
echo   Password: admin
echo.
pause
