resource "github_actions_secret" "this" {
  for_each    = var.secrets
  repository  = var.repo
  secret_name = each.key
  value       = sensitive(each.value)
}

resource "github_actions_variable" "this" {
  for_each    = var.variables
  repository  = var.repo
  variable_name = each.key
  value = each.value
}
