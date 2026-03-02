@echo off
echo ========================================
echo    CampaignX - System Verification
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js installed
echo.

echo [2/5] Checking Backend files...
if not exist "backend\package.json" (
    echo ERROR: Backend package.json missing!
    pause
    exit /b 1
)
if not exist "backend\src\server.js" (
    echo ERROR: Backend server.js missing!
    pause
    exit /b 1
)
echo ✓ Backend files present
echo.

echo [3/5] Checking Frontend files...
if not exist "frontend\package.json" (
    echo ERROR: Frontend package.json missing!
    pause
    exit /b 1
)
if not exist "frontend\src\App.jsx" (
    echo ERROR: Frontend App.jsx missing!
    pause
    exit /b 1
)
echo ✓ Frontend files present
echo.

echo [4/5] Checking .env file...
if not exist "backend\.env" (
    echo WARNING: .env file not found!
    echo Please create backend\.env with your API key
    echo Copy from backend\.env.example
    echo.
) else (
    echo ✓ .env file exists
)
echo.

echo [5/5] Checking documentation...
if not exist "README.md" (
    echo WARNING: README.md missing!
) else (
    echo ✓ README.md present
)
if not exist "docs\demo-script.md" (
    echo WARNING: Demo script missing!
) else (
    echo ✓ Demo script present
)
echo.

echo ========================================
echo    System Check Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Install dependencies:
echo    cd backend ^&^& npm install
echo    cd frontend ^&^& npm install
echo.
echo 2. Configure .env:
echo    Add your GEMINI_API_KEY to backend\.env
echo.
echo 3. Start servers:
echo    Terminal 1: cd backend ^&^& npm start
echo    Terminal 2: cd frontend ^&^& npm run dev
echo.
echo 4. Open: http://localhost:3000
echo.
pause
