# Copyright IBM Corp. 2022, 2026
# SPDX-License-Identifier: MPL-2.0

#Instana website monitoring resource
resource "instana_website_monitoring_config" "this" {
  name = var.website_name
}
