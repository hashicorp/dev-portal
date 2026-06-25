variable "project_id" {
  description = "Vercel project ID."
  type        = string
}

variable "team_id" {
  description = "Vercel team slug or team ID."
  type        = string
}

variable "environment" {
  description = "Map of environment variable definitions keyed by env var name."
  type = map(object({
    value          = string
    targets        = optional(list(string))
    sensitive      = optional(bool, true)
    comment        = optional(string)
    client_visible = optional(bool, false)
  }))
  default = {}
}
