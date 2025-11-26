variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "hostel-rg"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "sql_server_name" {
  description = "Name of the SQL server"
  type        = string
  default     = "hostel-server-2024"
}

variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "hostel_management"
}

variable "sql_admin_username" {
  description = "SQL Server admin username"
  type        = string
  default     = "hostel_admin"
}

variable "sql_admin_password" {
  description = "SQL Server admin password"
  type        = string
  sensitive   = true
}

variable "app_name" {
  description = "Name of the web app"
  type        = string
  default     = "hostel-app-jayanee"
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}