# Azure Resource Creation Script
# Run this in Azure Cloud Shell or with Azure CLI installed

# Variables
$resourceGroup = "hostel-rg"
$location = "East US"
$appServicePlan = "hostel-plan"
$webAppName = "hostel-allocation-app-$(Get-Random)"

# Create Resource Group
az group create --name $resourceGroup --location $location

# Create App Service Plan
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku B1 --is-linux

# Create Web App
az webapp create --resource-group $resourceGroup --plan $appServicePlan --name $webAppName --runtime "NODE|18-lts"

# Configure App Settings
az webapp config appsettings set --resource-group $resourceGroup --name $webAppName --settings NODE_ENV=production

Write-Host "Web App Name: $webAppName"
Write-Host "URL: https://$webAppName.azurewebsites.net"