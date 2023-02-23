/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Rewrite Waypoint `plugin` links to `integrations`.
 *
 * Waypoint /plugins have been moved to /integrations. We have redirects
 * set up to handle this, and we hope to update these links in content,
 * but as a temporary solution we can rewrite these links at compile time.
 *
 * Note: we intentionally run this _after_ URLs have been normalized to
 * include their product prefix. This way, regardless of whether Waypoint
 * content authors are writing `/plugins` or `/waypoint/plugins`, we should
 * apply the `plugins` → `integrations` rewrites correctly.
 *
 * TODO: We can remove this at some point.
 * https://app.asana.com/0/1203792616809419/1203879536690933
 */
export function rewriteWaypointPluginsToIntegrations(inputUrl: string): string {
	if (inputUrl === '/waypoint/plugins') {
		// Handle the root path
		return '/waypoint/integrations'
	} else if (inputUrl.startsWith('/waypoint/plugins')) {
		// Handle all plugins paths
		const pluginSlug = inputUrl.replace('/waypoint/plugins/', '')
		return `/waypoint/integrations/hashicorp/${pluginSlug}`
	} else {
		// Otherwise, return the input URL without modification
		return inputUrl
	}
}
