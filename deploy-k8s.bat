@echo off
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