@echo off
echo === Docker Status Check ===
echo.

echo 1. Docker version:
docker --version
echo.

echo 2. Running containers:
docker ps
echo.

echo 3. All containers (including stopped):
docker ps -a
echo.

echo 4. Docker images:
docker images
echo.

echo 5. Docker compose status:
docker-compose ps
echo.

echo 6. Container logs (if running):
docker-compose logs --tail=20
echo.

pause