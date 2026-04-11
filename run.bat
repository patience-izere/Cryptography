@echo off
REM ===========================================================================
REM Quick Start Batch File for Encryption Demo
REM ===========================================================================

echo.
echo =====================================================
echo   Encryption Algorithms Demo - Quick Start
echo =====================================================
echo.

REM Check if requirements.txt exists
if not exist requirements.txt (
    echo Error: requirements.txt not found!
    echo Please run this script from the project directory.
    pause
    exit /b 1
)

REM Install dependencies
echo [1/3] Installing Python dependencies...
pip install -r requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Dependencies installed successfully!
echo.

REM Run tests (optional)
echo [3/3] Running tests...
python test_encryption.py

if %ERRORLEVEL% NEQ 0 (
    echo Warning: Tests had some issues, but continuing...
)

echo.
echo =====================================================
echo   Starting Flask Application...
echo =====================================================
echo.
echo The application will open at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start Flask app
python app.py

pause
