provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "hostel_rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_mssql_server" "hostel_server" {
  name                         = var.sql_server_name
  resource_group_name          = azurerm_resource_group.hostel_rg.name
  location                     = azurerm_resource_group.hostel_rg.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
}

resource "azurerm_mssql_database" "hostel_db" {
  name      = var.database_name
  server_id = azurerm_mssql_server.hostel_server.id
  sku_name  = "Basic"
}

resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.hostel_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_service_plan" "hostel_plan" {
  name                = "${var.app_name}-plan"
  resource_group_name = azurerm_resource_group.hostel_rg.name
  location            = azurerm_resource_group.hostel_rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "hostel_app" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.hostel_rg.name
  location            = azurerm_service_plan.hostel_plan.location
  service_plan_id     = azurerm_service_plan.hostel_plan.id

  site_config {
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "DB_SERVER"       = azurerm_mssql_server.hostel_server.fully_qualified_domain_name
    "DB_NAME"         = azurerm_mssql_database.hostel_db.name
    "DB_USER"         = var.sql_admin_username
    "DB_PASSWORD"     = var.sql_admin_password
    "OPENAI_API_KEY"  = var.openai_api_key
  }
}