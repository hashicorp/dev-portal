/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { OperationProps, OperationGroup } from '../types'
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
export function groupOperations(
	operationObjects: OperationProps[]
): OperationGroup[] {
	// Determine if this set of operations has meaningful tags.
	// If there's only a single tag, it won't be meaningful to group by it.
	const allTags = operationObjects.map((o) => o.tags).flat()
	const uniqueTags = Array.from(new Set(allTags))
	const hasMeaningfulTags = uniqueTags.length > 1
	// Group operations by meaningful tags if present,
	// or by their paths otherwise.
	const operationGroupsMap = operationObjects.reduce(
		(
			acc: Record<string, { heading: string; items: OperationProps[] }>,
			o: OperationProps
		) => {
			/**
			 * If this operation has a tag, and we have meaningful tags to group by,
			 * then use the first tag as the group. Otherwise, fallback to path-based
			 * grouping.
			 *
			 * Note: we could potentially end up with a mix of tag- and path-based
			 * grouping. It's up to spec authors to control their groupings!
			 */
			const groupSlug =
				o.tags.length && hasMeaningfulTags ? o.tags[0] : o.path.truncated
			if (!acc[groupSlug]) {
				acc[groupSlug] = {
					heading: addWordBreaksToUrl(groupSlug),
					items: [],
				}
			}
			acc[groupSlug].items.push(o)
			return acc
		},
		{} as Record<string, OperationGroup>
	)

	return Object.values(operationGroupsMap)
}
