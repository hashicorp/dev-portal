variable "instana_production_endpoint_token" {
  description = "Instana API token. If null, provider can read INSTANA_API_TOKEN env var."
  type        = string
  sensitive   = true
  default     = null
}

variable "instana_production_endpoint" {
  description = "Instana tenant endpoint, e.g. tenant-org.instana.io. If null, provider can read INSTANA_ENDPOINT env var."
  type        = string
  default     = null
}

variable "website_name" {
  description = "Website monitoring config name to create in Instana."
  type        = string
  default     = "developer.hashicorp.com"
}
