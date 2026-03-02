@echo off
echo ========================================
echo    CampaignX - Quick Start
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo ========================================
echo    Installation Complete!
echo ========================================
echo.
echo IMPORTANT: Configure your API key
echo 1. Edit backend\.env
echo 2. Add: GEMINI_API_KEY=your_key_here
echo 3. Get key from: https://makersuite.google.com/app/apikey
echo.
echo Then run:
echo   start-backend.bat  (Terminal 1)
echo   start-frontend.bat (Terminal 2)
echo.
pause
