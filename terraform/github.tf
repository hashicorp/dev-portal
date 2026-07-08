module "github_repo" {
  source = "./github_repo"

  repo = var.github_repository
  variables = {
    INSTANA_OTLP_ENDPOINT = var.instana_otlp_endpoint
  }
  secrets = {
    INSTANA_OTLP_API_TOKEN = var.instana_agent_key
  }
}
