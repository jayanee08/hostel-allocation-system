#!/bin/bash

echo "🚀 Starting Hostel App Deployment"

# Initialize Terraform
echo "📋 Initializing Terraform..."
cd terraform
terraform init

# Plan deployment
echo "📊 Planning deployment..."
terraform plan

# Apply deployment
echo "🔧 Applying deployment..."
terraform apply -auto-approve

# Get outputs
echo "📤 Getting deployment outputs..."
terraform output

echo "✅ Deployment completed!"
echo "🌐 Your app will be available at the URL shown above"