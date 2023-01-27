/** This REGEX is used to parse a product version from a URL */
export const VERSION_IN_PATH_REGEX = /v\d+\.\d+\.(\d+|\w+)/i

/** This REGEX is used to parse a Terraform Enterprise version from a URL */
export const TFE_VERSION_IN_PATH_REGEXP = /v[0-9]{6}-\d+/i

/**
 * TODO - validate the expected versioned integrations paths for other products
 * Left the 'v' as optional here in case there is variation between the products
 */
export const VERSION_IN_INTEGRATIONS_PATH_REGEX = /v?\d+\.\d+\.(\d+|\w+)/i
