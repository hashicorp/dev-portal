terraform {
  required_version = ">= 1.15.0"

  required_providers {
    instana = {
      source  = "instana/instana"
      version = ">= 7.0.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = ">= 2.0.0"
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
# Provider api token and endpoint come from varsets in HCP:
# INSTANA_API_TOKEN
# INSTANA_ENDPOINT
# INSTANA_TLS_SKIP_VERIFY
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_slug
}
