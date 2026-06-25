module "vercel_project" {
  source = "./vercel_project"

  project_id = var.vercel_project_id
  team_id    = var.vercel_team_slug
  environment = {
    INSTANA_AGENT_KEY = {
      value          = instana_website_monitoring_config.devdot.id
      sensitive      = true
      comment        = "Instana RUM/EUM beacon key for devdot."
      client_visible = true
    }
  }
}
