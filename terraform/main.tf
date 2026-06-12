#Instana website monitoring resource
resource "instana_website_monitoring_config" "this" {
  name = var.website_name
}
