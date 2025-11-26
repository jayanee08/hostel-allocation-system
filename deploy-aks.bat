@echo off
echo === Azure Kubernetes Service Deployment ===
echo.

echo Step 1: Login to Azure
az login

echo Step 2: Create Resource Group
az group create --name hostel-rg --location eastus

echo Step 3: Create AKS Cluster
az aks create --resource-group hostel-rg --name hostel-aks --node-count 2 --enable-addons monitoring --generate-ssh-keys

echo Step 4: Get AKS Credentials
az aks get-credentials --resource-group hostel-rg --name hostel-aks

echo Step 5: Create Azure Container Registry
az acr create --resource-group hostel-rg --name hostelregistry2024 --sku Basic

echo Step 6: Attach ACR to AKS
az aks update -n hostel-aks -g hostel-rg --attach-acr hostelregistry2024

echo.
echo === Setup Complete! ===
echo Next: Run deploy-k8s.bat to deploy your application
pause