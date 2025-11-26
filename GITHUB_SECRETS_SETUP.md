# GitHub Secrets Setup for CI/CD

To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret below

## Required Secrets

### Azure Deployment Secrets

**AZURE_CREDENTIALS**
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

**AZURE_WEBAPP_PUBLISH_PROFILE**
- Download from Azure Portal → App Service → Get publish profile
- Copy the entire XML content

### Database Secrets

**DB_USER**
```
hostel_admin
```

**DB_PASSWORD**
```
Nikhil&2005
```

**DB_SERVER**
```
hostel-server-2024.database.windows.net
```

**DB_NAME**
```
hostel_management
```

### Additional Secrets

**SQL_ADMIN_PASSWORD** (for Terraform)
```
Nikhil&2005
```

**OPENAI_API_KEY**
```
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
```

## How to Get Azure Credentials

### Method 1: Using Azure CLI
```bash
az ad sp create-for-rbac --name "github-actions" --role contributor --scopes /subscriptions/{subscription-id} --sdk-auth
```

### Method 2: Using Azure Portal
1. Go to Azure Active Directory
2. App registrations → New registration
3. Create service principal
4. Add contributor role to subscription
5. Create client secret
6. Format as JSON above

## Environments Setup

1. Go to repository **Settings** → **Environments**
2. Create environment named **production**
3. Add protection rules if needed
4. Add environment-specific secrets

## Testing the Pipeline

1. Push code to main branch
2. Check **Actions** tab in GitHub
3. Monitor the pipeline execution
4. Verify deployment at: https://hostel-app-jayanee.azurewebsites.net

## Troubleshooting

- Check Actions logs for detailed error messages
- Verify all secrets are correctly set
- Ensure Azure resources exist
- Check Azure App Service logs

## Pipeline Features

✅ **Build and Test** - Installs dependencies, runs tests, builds Docker image
✅ **Security Audit** - Runs npm audit for vulnerabilities
✅ **Database Setup** - Tests database connection
✅ **Azure Deployment** - Deploys to Azure Web App
✅ **Health Check** - Verifies deployment success
✅ **Terraform Support** - Infrastructure as Code (optional)
✅ **Notifications** - Success/failure notifications