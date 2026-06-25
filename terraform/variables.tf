variable "website_name" {
  description = "Website monitoring config name to create in Instana."
  type        = string
  default     = "developer.hashicorp.com"
}

# -------------------------
# Vercel
# -------------------------
variable "vercel_api_token" {
  description = "Vercel API token. Can also be set via VERCEL_API_TOKEN env var."
  type        = string
  sensitive   = true
}

variable "vercel_team_slug" {
  description = "Vercel team slug (the part after vercel.com/ in your team URL)."
  type        = string
}

variable "vercel_project_id" {
  description = "Vercel project ID. Find it in Project Settings → General."
  type        = string
}
