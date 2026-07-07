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
