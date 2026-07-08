module "github_repo" {
  source = "./github_repo"

  repo = "dev-portal"
  variables = {
    INSTANA_OTLP_ENDPOINT = var.instana_otlp_endpoint
  }
  secrets = {
    INSTANA_OTLP_API_TOKEN = var.instana_agent_key
  }
}
