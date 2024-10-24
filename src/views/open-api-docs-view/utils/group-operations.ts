/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { addWordBreaksToUrl } from './add-word-breaks-to-url'

/**
 * Given a flat array of operation prop objects,
 * Return an array of operation groups
 *
 * Operation groups are constructed by organizing the incoming
 * operation prop objects by their paths.
 *
 * EXAMPLE
 *
 * As an example, we might start with operation paths that look like:
 *
 * 1. ListApps - /secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/apps
 * 2. CreateApp - /secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/apps
 * 3. GetApp - /secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/apps/{app_name}
 * 4. GetAppSecret - /secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/apps/{app_name}/secrets/{secret_name}
 * 5. CreateAwsSmSyncIntegration - /secrets/2023-06-13/organizations/{organization_id}/projects/{project_id}/sync/aws-sm
 *
 * We truncate these paths to remove their common prefix, leaving us with:
 *
 * 1. ListApps - /apps
 * 2. CreateApp - /apps
 * 3. GetApp - /apps/{app_name}
 * 4. GetAppSecret - /apps/{app_name}/secrets/{secret_name}
 * 5. CreateAwsSmSyncIntegration - /sync/aws-sm
 *
 * Then, we use the **first two path segments** to group the operations,
 * yielding something like the following::
 *
 * {
 *	  '/apps': {
 *		  heading: '/apps',
 *		  items: [ 'ListApps', 'CreateApp' ]
 *	  },
 *	  '/apps/{app_name}': {
 *		  heading: '/apps/{app_name}',
 *		  items: [ 'GetApp', 'GetAppSecret' ]
 *	  },
 *	  '/sync/aws-sm': {
 *		  heading: '/sync/aws-sm',
 *		  items: [ 'CreateAwsSmSyncIntegration' ]
 *	  },
 * }
 */
export function groupOperations<
	Operation extends { path: { truncated: string }; tags: string[] }
>(
	operationObjects: Operation[],
	groupOperationsByPath: boolean
): { heading: string; items: Operation[] }[] {
	// Group operations, either by tags where specified, or automatically by paths
	// or by their paths otherwise.
	const operationGroupsMap = operationObjects.reduce(
		(
			acc: Record<string, { heading: string; items: Operation[] }>,
			o: Operation
		) => {
			/**
			 * Determine the grouping slug for this operation.
			 *
			 * If path-based grouping has been specified, we ignore tags and group
			 * based on the operation URL paths (truncated to remove common parts).
			 *
			 * If tag-based grouping is used, note that we may need to fall back
			 * to an "Other" tag for potentially untagged operations.
			 */
			let groupSlug: string
			if (groupOperationsByPath) {
				groupSlug = o.path.truncated.split('/').slice(0, 3).join('/')
			} else {
				groupSlug = (o.tags.length && o.tags[0]) ?? 'Other'
			}
			const hasExistingGroup = groupSlug in acc
			if (!hasExistingGroup) {
				acc[groupSlug] = {
					heading: addWordBreaksToUrl(groupSlug),
					items: [],
				}
			}
			acc[groupSlug].items.push(o)
			return acc
		},
		{} as Record<string, { heading: string; items: Operation[] }>
	)

	return Object.values(operationGroupsMap)
}
