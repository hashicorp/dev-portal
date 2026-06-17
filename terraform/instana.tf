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

  # Filter out any request where the extension ends with one of these values
  static_asset_extensions = [
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
  ]

  browser_exclusion_clauses = [
    "beacon.browser.name@na NOT_CONTAIN 'bot'",
    "beacon.browser.name@na NOT_EQUAL 'Slurp'",
    "beacon.browser.name@na NOT_EQUAL 'DuckDuckGo-Favicons-Bot'",
  ]

  # Generate a tag filter expression to exclude static assets and selected bots.
  static_asset_tag_filter = "(${join(
    " AND ",
    concat(
      [
        for ext in local.static_asset_extensions :
        "beacon.http.url@na NOT_ENDS_WITH '${ext}'"
      ],
      local.browser_exclusion_clauses
    )
  )})"
}

resource "instana_website_alert_config" "status_codes_alerts" {
  name        = "[Alert] High Volume of 404 Errors - ${instana_website_monitoring_config.devdot.name}"
  description = "High volume of 404 responses detected for ${instana_website_monitoring_config.devdot.name}"
  enabled     = true
  triggering  = false
  website_id  = local.website_monitoring_id
  granularity = var.not_found_granularity_minutes * 60000

  alert_channel_ids = local.alert_channel_ids

  rules = [
    {
      operator = ">="
      rule = {
        status_code = {
          aggregation = "SUM"
          metric_name = "httpxxx"
          operator    = "EQUALS"
          value       = "404"
        },
      }
      threshold = {
        warning = {
          static = {
            value = var.not_found_warning_threshold
          }
        }
        critical = {
          static = {
            value = var.not_found_critical_threshold
          }
        }
      }
    }
  ]

  # Exclude static asset URLs using a generated filter expression.
  tag_filter = local.static_asset_tag_filter

  time_threshold = {
    violations_in_period = {
      violations  = 1
      time_window = var.not_found_time_window_minutes * 60000
    }
  }
}
