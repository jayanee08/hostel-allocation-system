output "resource_group_name" {
  value = azurerm_resource_group.hostel_rg.name
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.hostel_server.fully_qualified_domain_name
}

output "database_name" {
  value = azurerm_mssql_database.hostel_db.name
}

output "web_app_url" {
  value = "https://${azurerm_linux_web_app.hostel_app.name}.azurewebsites.net"
}