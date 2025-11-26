@echo off
echo Starting Docker deployment for Hostel Allocation System...

echo Step 1: Building Docker image...
docker build -t hostel-app .

echo Step 2: Running with Docker Compose...
docker-compose up -d

echo Step 3: Checking container status...
docker ps

echo.
echo Application should be running at: http://localhost:8080
echo.
echo To stop: docker-compose down
pause