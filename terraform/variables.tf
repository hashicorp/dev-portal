variable "website_name" {
  description = "Website monitoring config name to create in Instana."
  type        = string
  default     = "developer.hashicorp.com"
}

variable "slack_app_id" {
  description = "Slack App ID (starts with A) for the Instana notification bot."
  type        = string
}

variable "slack_channel_name" {
  description = "The name of the Slack channel to send alerts to."
  type        = string
}

variable "slack_channel_id" {
  description = "Slack channel ID."
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

variable "not_found_granularity_minutes" {
  description = "Evaluation granularity in minutes for 404 alerts."
  type        = number
  default     = 5
}

variable "not_found_time_window_minutes" {
  description = "Violation sequence time window in minutes for 404 alerts. Instana's violations_in_period threshold type caps this at 60 minutes; use a value that is a multiple of not_found_granularity_minutes."
  type        = number
  default     = 60
}

variable "not_found_warning_threshold" {
  description = "Warning threshold for 404 alerts. Default is scaled for a 60-minute window (8000 / 4 from the original 4h Datadog window)."
  type        = number
  default     = 2000
}

variable "not_found_critical_threshold" {
  description = "Critical threshold for 404 alerts. Default is scaled for a 60-minute window (12000 / 4 from the original 4h Datadog window)."
  type        = number
  default     = 3000
}
