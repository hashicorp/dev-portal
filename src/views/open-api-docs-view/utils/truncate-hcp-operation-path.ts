/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Specific HCP service paths start with the service name,
 * followed by a date-based version number,
 * and always include "organization" and "project" parameters.
 *
 * We remove all of this prefix from the path for better grouping
 * of operations within the specific spec.
 *
 * @example `/secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/apps`
 * Or more generically:
 * `/<service>/<version>/organizations/{organization_id}/projects/{project_id}`
 */
const SPECIFIC_SERVICE_PATTERN =
	/(\/[a-z]*\/\d\d\d\d-\d\d-\d\d\/organizations\/\{[a-z_.]*\}\/projects\/\{[a-z_.]*\})/

/**
 * Global HCP service paths start with the service name,
 * and always include "organization" and "project" parameters.
 *
 * We remove the version prefix from the path for better grouping.
 *
 * @example "/2022-02-15/some-global-service/{parameter}/etc"
 * Or more generically:
 * `/<version>/...(anything)`
 */
const GLOBAL_SERVICE_PATTERN = /\/\d\d\d\d-\d\d-\d\d/

/**
 * Truncates HCP operation paths for brevity, removing the service, version,
 * organization, and project prefixes for specific individual services, and
 * removing the version prefix for global services.
 */
export function truncateHcpOperationPath(path: string) {
	return path
		.replace(SPECIFIC_SERVICE_PATTERN, '')
		.replace(GLOBAL_SERVICE_PATTERN, '')
}
