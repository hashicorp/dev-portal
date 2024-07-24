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
	currentVersion,
	productSlugForLoader,
	docsBasePath
) {
	// Rewrite all URLs to use the content API for assets
	let assetPrefix = `${process.env.MKTG_CONTENT_API}/assets/${productSlugForLoader}/${currentVersion}`
	console.log({ assetPrefix })
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
