@echo off
echo ========================================
echo   HOSTEL MANAGEMENT SYSTEM - GITHUB UPLOAD
echo ========================================
echo.

echo Step 1: Create a new repository on GitHub
echo 1. Go to https://github.com/new
echo 2. Repository name: hostel-management-system
echo 3. Description: Hostel Room Allocation System with Azure SQL and CI/CD
echo 4. Make it Public or Private (your choice)
echo 5. DO NOT initialize with README, .gitignore, or license
echo 6. Click "Create repository"
echo.

set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/hostel-management-system.git): "

if "%REPO_URL%"=="" (
    echo Error: Repository URL is required!
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Project uploaded to GitHub
    echo ========================================
    echo.
    echo Your CI/CD pipeline will automatically:
    echo - Build and test your application
    echo - Deploy to Azure Web App
    echo - Run health checks
    echo.
    echo Next steps:
    echo 1. Go to your GitHub repository
    echo 2. Click on "Actions" tab to see CI/CD pipeline
    echo 3. Add Azure secrets in Settings ^> Secrets and variables ^> Actions:
    echo    - AZURE_WEBAPP_PUBLISH_PROFILE
    echo.
    echo Repository URL: %REPO_URL%
) else (
    echo.
    echo ========================================
    echo   ERROR: Failed to push to GitHub
    echo ========================================
    echo.
    echo Please check:
    echo 1. Repository URL is correct
    echo 2. You have access to the repository
    echo 3. Repository exists and is empty
)

echo.
pause