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
 */
const SPECIFIC_SERVICE_PATTERN =
	/(\/[a-z]*\/\d\d\d\d-\d\d-\d\d\/organizations\/\{[a-z_.]*\}\/projects\/\{[a-z_.]*\})/

/**
 * Global HCP service paths start with the service name,
 * and always include "organization" and "project" parameters.
 *
 * We remove the version prefix from the path for better grouping.
 */
const GLOBAL_SERVICE_PATTERN = /\/\d\d\d\d-\d\d-\d\d\//
/**
 * Truncates HCP operation paths for clarity.
 *
 * TODO: this is a shim for development.
 * We'll almost certainly want something like this, but needs may change.
 *
 * For now, we at least use it to help group operations by their path,
 * as grouping only really makes sense if we remove the extended prefix.
 */
export function truncateHcpOperationPath(path: string) {
	return path
		.replace(SPECIFIC_SERVICE_PATTERN, '')
		.replace(GLOBAL_SERVICE_PATTERN, '')
}
