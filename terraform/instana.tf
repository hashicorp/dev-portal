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

locals {
  website_monitoring_id = instana_website_monitoring_config.devdot.id
  alert_channel_ids = toset([
    instana_alerting_channel.slack.id,
  ])

  status_code_alerts = {
    not_found_errors = {
      label       = "404"
      metric_name = "httpxxx"
      operator    = "EQUALS"
      value       = "404"
    }
    server_errors = {
      label       = "5xx"
      metric_name = "httpxxx"
      operator    = "STARTS_WITH"
      value       = "5"
    },
  }

  granularity_milliseconds = var.granularity_minutes * 60000
  time_window_milliseconds = var.time_window_minutes * 60000
}

resource "instana_website_alert_config" "status_codes_alerts" {
  for_each    = local.status_code_alerts
  name        = "${var.website_name} ${each.value.label} status code detected"
  description = "${var.website_name} ${each.value.label} status code detected"
  enabled     = true
  triggering  = false
  website_id  = local.website_monitoring_id
  granularity = local.granularity_milliseconds

  alert_channel_ids = local.alert_channel_ids

  rules = [
    {
      operator = ">="
      rule = {
        status_code = {
          aggregation = "SUM"
          metric_name = each.value.metric_name
          operator    = each.value.operator
          value       = each.value.value
        },
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
    violations_in_period = {
      violations  = 1
      time_window = local.time_window_milliseconds
    }
  }
}
