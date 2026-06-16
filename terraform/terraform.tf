terraform {
  required_version = ">= 1.15.0"

  required_providers {
    instana = {
      source  = "instana/instana"
      version = ">= 7.0.0"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "hashicorp-mktg"
    workspaces {
      name = "dev-portal"
    }
  }
}

provider "instana" {
  api_token = var.instana_production_endpoint_token
  endpoint  = var.instana_production_endpoint
}
