@echo off
echo Building Docker image for Hostel Management System...
docker build -t hostel-management .

echo.
echo Running container on port 8080...
docker run -d -p 8080:8080 --name hostel-app hostel-management

echo.
echo Container started! Access the application at:
echo http://localhost:8080
echo.
echo To stop the container, run: docker stop hostel-app
echo To remove the container, run: docker rm hostel-app