#Instana website monitoring resource
resource "instana_website_monitoring_config" "devdot" {
  name = var.website_name
}

resource "instana_alerting_channel" "slack" {
  name = var.slack_channel_name
  slack_app = {
    app_id       = var.slack_app_id
    team_id      = var.slack_team_id
    team_name    = var.slack_team_name
    channel_id   = var.slack_channel_id
    channel_name = var.slack_channel_name
  }
}

resource "instana_website_alert_config" "js_errors" {
  name         = "${var.website_name} new RUM error detected"
  description  = "${var.website_name} new RUM error detected"
  enabled      = true
  triggering   = false
  website_id   = instana_website_monitoring_config.devdot.id
  granularity  = var.granularity_minutes * 60000
  grace_period = var.rum_alert_grace_period_minutes * 60000

  alert_channel_ids = [
    instana_alerting_channel.slack.id,
  ]

  rules = [
    {
      operator = ">="
      rule = {
        specific_js_error = {
          metric_name = "errors"
          aggregation = "SUM"
          operator    = "NOT_EMPTY"
          value       = "Any"
        }
      }
      threshold = {
        warning = {
          static = {
            value = var.warning_threshold
          }
        }
        critical = {
          static = {
            value = var.critical_threshold
          }
        }
      }
    }
  ]

  time_threshold = {
    violations_in_sequence = {
      time_window = var.time_window_minutes * 60000
    }
  }
}

# @todo Remove after apply - don't actually need to, but this will be a no-op
# so we should probably clean it up
import {
  id = "BkwLjIyeSQasx5EBFRAc3g"
  to = instana_application_config.devdot
}
resource "instana_application_config" "devdot" {
  label          = "web-devdot - ${var.github_repository}"
  boundary_scope = "INBOUND"
  scope          = "INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING"
}


locals {
  application = [{
    application_id = instana_application_config.devdot.id
    inclusive      = true
    service        = []
  }]
  application_alert_channels = {
    CRITICAL = []
    WARNING = [
      instana_alerting_channel.slack.id,
    ]
  }
}

# @todo Remove after apply - don't actually need to, but this will be a no-op
# so we should probably clean it up
import {
  id = "GHOlFdRaQzef02Ixy0nhcg"
  to = instana_application_alert_config.repo_sync_failed_alert
}
resource "instana_application_alert_config" "repo_sync_failed_alert" {
  name            = "${var.github_repository} repo-sync failed"
  tag_filter      = "endpoint.name@dest EQUALS 'repo-sync-failed'"
  description     = "A ${var.github_repository}-internal repo sync failed: https://github.com/hashicorp/${var.github_repository}-internal/actions/workflows/repo-sync.yml."
  evaluation_type = "PER_AP"
  application     = local.application
  alert_channels  = local.application_alert_channels
  time_threshold = {
    violations_in_period = {
      time_window = var.instana_application_violation_time_window_minutes * 60000
      violations  = 1
    }
  }
  rules = [{
    rule = {
      throughput = {
        aggregation = "SUM"
        metric_name = "calls"
      }
    }
    threshold_operator = ">="
    threshold = {
      warning = {
        static = {
          value = var.instana_repo_sync_failed_warning_threshold
        }
      }
    }
  }]
  boundary_scope = "INBOUND"
}

# @todo Remove after apply - don't actually need to, but this will be a no-op
# so we should probably clean it up
import {
  id = "tYXabw6kT46BR8VG3h5vWw"
  to = instana_application_alert_config.not_found_alert
}
resource "instana_application_alert_config" "not_found_alert" {
  name            = "high docs content-not-found errors"
  tag_filter      = "endpoint.name@dest EQUALS 'content-not-found'"
  description     = "Large number of docs content that doesn't exist requested on ${var.website_name}."
  evaluation_type = "PER_AP"
  application     = local.application
  alert_channels  = local.application_alert_channels
  time_threshold = {
    violations_in_period = {
      time_window = var.instana_application_violation_time_window_minutes * 60000
      violations  = 1
    }
  }
  rules = [{
    rule = {
      throughput = {
        aggregation = "SUM"
        metric_name = "calls"
      }
    }
    threshold_operator = ">="
    threshold = {
      warning = {
        static = {
          value = var.instana_content_not_found_warning_threshold
        }
      }
    }
  }]
  boundary_scope = "INBOUND"
}
