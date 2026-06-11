terraform {
  required_version = ">= 1.5.0"

  required_providers {
    instana = {
      source  = "instana/instana"
      version = ">= 7.0.0"
    }
  }
}

provider "instana" {
  api_token = var.instana_api_token
  endpoint  = var.instana_endpoint
}

resource "instana_website_monitoring_config" "this" {
  name = var.website_name
}
