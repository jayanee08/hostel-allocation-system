@echo off
<<<<<<< HEAD
echo Deploying Hostel Management System to Kubernetes...

echo.
echo Applying ConfigMap and Secrets...
kubectl apply -f k8s-configmap.yaml

echo.
echo Applying Deployment and Service...
kubectl apply -f k8s-deployment.yaml

echo.
echo Checking deployment status...
kubectl get pods -l app=hostel-app
kubectl get services hostel-service

echo.
echo Deployment complete! Use the following commands to monitor:
echo kubectl get pods
echo kubectl logs deployment/hostel-app
echo kubectl get services
=======
echo === Deploying to Azure Kubernetes Service ===
echo.

echo Step 1: Build and tag Docker image
docker build -t hostel-app .
docker tag hostel-app hostelregistry2024.azurecr.io/hostel-app:latest

echo Step 2: Login to Azure Container Registry
az acr login --name hostelregistry2024

echo Step 3: Push image to ACR
docker push hostelregistry2024.azurecr.io/hostel-app:latest

echo Step 4: Apply Kubernetes manifests
kubectl apply -f k8s-configmap.yaml
kubectl apply -f k8s-deployment.yaml

echo Step 5: Check deployment status
kubectl get pods
kubectl get services

echo.
echo === Deployment Complete! ===
echo Run: kubectl get services --watch
echo Wait for EXTERNAL-IP to be assigned
pause
>>>>>>> 19dd94f0b185677226cb0f094c64f9baec816ab3
