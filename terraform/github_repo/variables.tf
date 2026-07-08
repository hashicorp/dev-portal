variable "repo" {
  description = "GitHub repository name."
  type        = string
}

variable "variables" {
  description = "Map of environment variables keyed by env var name."
  type = map(string)
  default = {}
}

variable "secrets" {
  description = "Map of environment secrets keyed by env var name."
  type = map(string)
  default = {}
}
