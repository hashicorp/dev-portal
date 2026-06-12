variable "instana_production_endpoint_token" {
  description = "Instana API token. If null, provider can read INSTANA_API_TOKEN env var."
  type        = string
  sensitive   = true
  default     = null
}

variable "instana_production_endpoint" {
  description = "Instana tenant endpoint, e.g. tenant-org.instana.io. If null, provider can read INSTANA_ENDPOINT env var."
  type        = string
  default     = null
}

variable "website_name" {
  description = "Website monitoring config name to create in Instana."
  type        = string
  default     = "developer.hashicorp.com"
}

variable "slack_app_id" {
  description = "Slack App ID (starts with A) for the Instana notification bot."
  type        = string
  default     = "A08AEK9NX41"
}

variable "slack_channel_name" {
  description = "The name of the slack channel to send alerts to"
  type        = string
  default     = "devdot-instana-digital-alerts"
}

variable "slack_channel_id" {
  description = "Slack channel ID"
  default     = "C0B9Y3JSL58"
  type        = string
}

variable "slack_team_name" {
  description = "The name of the slack team that contains the channel to send alerts to"
  type        = string
}

variable "slack_team_id" {
  description = "Slack team ID. You can find this by inspecting the URL of your Slack workspace (e.g. https://app.slack.com/client/<team ID>)"
  type        = string
}

variable "granularity_minutes" {
  description = "Evaluation granularity in minutes."
  type        = number
  default     = 5
}

variable "time_window_minutes" {
  description = "Violation sequence time window in minutes."
  type        = number
  default     = 5
}

variable "warning_threshold" {
  description = "Warning threshold for JS error count. Use 1 to mimic Datadog y > 0 behavior."
  type        = number
  default     = 1
}

variable "critical_threshold" {
  description = "Critical threshold for JS error count."
  type        = number
  default     = 2
}
