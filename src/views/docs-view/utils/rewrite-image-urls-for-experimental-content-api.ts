const REPO_CONFIG_CONTENT_DIR: Record<string, string> = {
	boundary: 'content',
	consul: 'content',
	'hcp-docs': 'content',
	nomad: 'content',
	packer: 'content',
	'ptfe-releases': 'docs',
	sentinel: 'content',
	terraform: 'docs',
	'terraform-cdk': 'docs',
	'terraform-docs-agents': 'docs',
	'terraform-docs-common': 'docs',
	'terraform-plugin-framework': 'docs',
	'terraform-plugin-log': 'docs',
	'terraform-plugin-mux': 'docs',
	'terraform-plugin-sdk': 'docs',
	'terraform-plugin-testing': 'docs',
	vagrant: 'content',
	vault: 'content',
	waypoint: 'content',
}

export function rewriteImageUrlsForExperimentalContentApi(
	url,
	currentPath,
	_currentVersion,
	productSlugForLoader,
	docsBasePath
) {
	/**
	 * Rewrite all URLs to use the content API for assets
	 *
	 * TODO: versioned assets are a work in progress.
	 *
	 * One option might be handle `currentVersion` here... but so far, in the
	 * unified docs repo `web-presence-experimental-docs`, we don't have a clear
	 * approach to versioned assets. Instead, all assets are currently in
	 * a single not-versioned directory.
	 *
	 * No matter what URL adjustment we do, we'll probably _not_ want to do it
	 * here, and instead we'll probably want to make `.mdx` image URL adjustments
	 * at *build time*, as part of our build time MDX transforms, over in
	 * `web-presence-experimental-docs`.
	 */
	let assetPrefix = `${process.env.MKTG_CONTENT_API}/assets/${productSlugForLoader}`
	/**
	 * TODO: we have some messy shims to handle asset organization.
	 * Probably ideal to standardize this in the content monorepo instead,
	 * maybe as part of a migration script in the content monorepo?
	 */
	if (url.startsWith('/')) {
		// Rewrite absolute URLs
		// TODO: maybe this should be done during content migration?
		return `${assetPrefix}${url}`
	} else if (url.startsWith('./')) {
		// Rewrite relative URLs
		// TODO: maybe this should be done during content migration?
		const currentPathRelative = currentPath.split('/').slice(0, -1).join('/')
		const contentDir = REPO_CONFIG_CONTENT_DIR[productSlugForLoader]
		const contentDirPrefix = `/img/${contentDir}/${docsBasePath}` // rootDocsPath.path
		const finalPath = `${assetPrefix}${contentDirPrefix}/${currentPathRelative}/${url.substring(
			2
		)}`
		return finalPath
	} else {
		return url
	}
}
