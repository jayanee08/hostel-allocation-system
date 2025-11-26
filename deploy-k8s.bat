@echo off
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