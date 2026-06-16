#Instana website monitoring resource
resource "instana_website_monitoring_config" "devdot" {
  name = var.website_name
}
