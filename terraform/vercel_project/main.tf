terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
    }
  }
}

resource "vercel_project_environment_variable" "this" {
  for_each = var.environment

  project_id = var.project_id
  team_id    = var.team_id
  key        = each.value.client_visible && !startswith(each.key, "NEXT_PUBLIC_") ? format("NEXT_PUBLIC_%s", each.key) : each.key
  value      = each.value.value
  target     = each.value.targets != null ? each.value.targets : ["production"]
  sensitive  = each.value.sensitive != null ? each.value.sensitive : true
  comment    = "${try(each.value.comment, "")} ${format("Managed by Terraform workspace %s. Do not edit manually.", terraform.workspace)}"
}
