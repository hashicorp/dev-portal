locals {
  environment = {
    INSTANA_WEBSITE_MONITORING_KEY = {
      value          = instana_website_monitoring_config.devdot.id
      sensitive      = false
      comment        = "Instana RUM/EUM beacon key for devdot."
      client_visible = true
      targets        = ["production", "preview", "development"]
    }
  }
}

# Vercel Project Environment Variables
resource "vercel_project_environment_variable" "this" {
  for_each   = local.environment
  project_id = var.vercel_project_id
  key        = each.value.client_visible && !startswith(each.key, "NEXT_PUBLIC_") ? format("NEXT_PUBLIC_%s", each.key) : each.key
  value      = each.value.value
  target     = coalesce(try(each.value.targets, null), ["production"])
  sensitive  = each.value.sensitive
  comment    = trimspace("${try(each.value.comment, "")} ${format("Managed by Terraform workspace %s. Do not edit manually.", terraform.workspace)}")
}
