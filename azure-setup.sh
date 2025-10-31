#!/bin/bash

# Azure CI/CD Setup Script for Hostel Management System

echo "🚀 Setting up Azure resources for CI/CD..."

# Variables
RESOURCE_GROUP="hostel-rg"
APP_NAME="hostel-management-app"
LOCATION="eastus"
SKU="B1"

# Create Resource Group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan
echo "📋 Creating app service plan..."
az appservice plan create \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku $SKU \
  --is-linux

# Create Web App
echo "🌐 Creating web app..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-plan" \
  --name $APP_NAME \
  --runtime "NODE|18-lts"

# Configure App Settings
echo "⚙️ Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    WEBSITE_NODE_DEFAULT_VERSION=18.17.0

# Get publish profile
echo "🔑 Getting publish profile..."
az webapp deployment list-publishing-profiles \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --xml

echo "✅ Azure setup complete!"
echo "📋 Next steps:"
echo "1. Copy the publish profile XML to GitHub Secrets as AZURE_WEBAPP_PUBLISH_PROFILE"
echo "2. Push your code to GitHub to trigger the pipeline"
echo "3. Monitor deployment at: https://${APP_NAME}.azurewebsites.net"