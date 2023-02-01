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
 * It'll likely make sense once we've cleaned up old links in content.
 * The vast majority of these links are in the `hashicorp/waypoint` repo.
 * To view all places we link `/waypoint/plugins`:
 * - Within `hashicorp/waypoint`, these URLs would be written as `/plugins`.
 *   Code Search: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fwaypoint+path%3A*.mdx+%22%2Fplugins%22
 * - In other repos, these URLs would be written as either
 *   waypoint.io/plugins, or developer.hashicorp.com/waypoint/plugins.
 *   Code Search for waypointproject.io: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fterraform+OR+repo%3Ahashicorp%2Fpacker+OR+repo%3Ahashicorp%2Fconsul+OR+repo%3Ahashicorp%2Fvault+OR+repo%3Ahashicorp%2Fboundary+OR+repo%3Ahashicorp%2Fnomad+OR+repo%3Ahashicorp%2Fvagrant+OR+repo%3Ahashicorp%2Ftutorials+path%3A*.mdx+content%3Awaypointproject.io
 *   Code Search for `/waypoint/plugins` links: https://cs.github.com/?scopeName=All+repos&scope=&q=repo%3Ahashicorp%2Fterraform+OR+repo%3Ahashicorp%2Fpacker+OR+repo%3Ahashicorp%2Fconsul+OR+repo%3Ahashicorp%2Fvault+OR+repo%3Ahashicorp%2Fboundary+OR+repo%3Ahashicorp%2Fnomad+OR+repo%3Ahashicorp%2Fvagrant+OR+repo%3Ahashicorp%2Ftutorials+path%3A*.mdx+content%3A%2Fwaypoint%2Fplugins
 *
 * TODO: remove the section below, meant to be a PR comment, I'm lazy/
 * You can check that these rewrites have worked by visiting docs such as
 * `/waypoint/docs/plugins` or `/waypoint/docs/runner/on-demand-runner`,
 * and also tutorials such as `/waypoint/tutorials/deploy-aws/aws-ecs`,
 * which have links in content source that point to `/plugins`, but with
 * this logic in place, should have been rewritten to `/integrations`.
 *
 */
export function rewriteWaypointPluginsToIntegrations(inputUrl: string): string {
	if (inputUrl === '/waypoint/plugins') {
		// Handle the root path
		return '/waypoint/integrations'
	} else if (inputUrl.startsWith('/waypoint/plugins')) {
		// Handle all plugins paths
		const pluginSlug = inputUrl.replace('/waypoint/plugins/', '')
		// Note: under `/plugins` we only ever had official `hashicorp` plugins
		// TODO: confirm whether the above is true, I'm actually not sure
		//       (if this isn't true, could maybe do an old plugin name -> org map?)
		// TODO: update from `BrandonRomano` to `hashicorp` once API content updates
		const pluginOrg = 'BrandonRomano'
		return `/waypoint/integrations/${pluginOrg}/${pluginSlug}`
	} else {
		// Otherwise, return the input URL without modification
		return inputUrl
	}
}
