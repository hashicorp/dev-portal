/** This REGEX is used to parse a product version from a URL */
export const VERSION_IN_PATH_REGEX = /v\d+\.\d+\.(\d+|\w+)/i

/** This REGEX is used to parse a Terraform Enterprise version from a URL */
export const TFE_VERSION_IN_PATH_REGEXP = /v[0-9]{6}-\d+/i
