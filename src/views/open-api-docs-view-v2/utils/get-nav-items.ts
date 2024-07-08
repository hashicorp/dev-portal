/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Utils
import { wordBreakCamelCase } from './word-break-camel-case'
// Types
import type { OpenAPIV3 } from 'openapi-types'
import type { OpenApiNavItem } from '../types'

/**
 * Build nav items for the OpenAPI view sidebar.
 *
 * We expect the sidebar navigation to be consistent across the landing view
 * and the individual operation views.
 *
 * TODO: this is mostly placeholder for now, needs to be properly implemented.
 */
export function getNavItems(
	baseUrl: string,
	operationSlug,
	openApiDocument: OpenAPIV3.Document
): OpenApiNavItem[] {
	/**
	 * Initialize the navItems array with a link to the landing view
	 */
	const navItems: OpenApiNavItem[] = [
		{
			title: 'Landing',
			fullPath: baseUrl,
			isActive: !operationSlug,
		},
	]

	/**
	 * Iterate over all paths in the openApiDocument.
	 * Each path can support many operations through different request types.
	 */
	for (const [_path, pathItemObject] of Object.entries(openApiDocument.paths)) {
		for (const [type, operation] of Object.entries(pathItemObject)) {
			// String values are apparently possible, but not sure how to support them
			if (typeof operation === 'string') {
				continue
			}
			// We only want operation objects.
			if (!('operationId' in operation)) {
				continue
			}

			// Push a nav item for this operation
			const { operationId } = operation
			navItems.push({
				title: `[${type}] ${wordBreakCamelCase(operationId)}`,
				fullPath: `${baseUrl}/${operationId}`,
				isActive: operationSlug === operationId,
			})
		}
	}

	return navItems
}
