// Third-party imports
import path from 'path'

// HashiCorp Imports
import FileSystemLoader from '@hashicorp/react-docs-page/server/loaders/file-system'
import RemoteContentLoader from '@hashicorp/react-docs-page/server/loaders/remote-content'
import {
	includeMarkdown,
	paragraphCustomAlerts,
} from '@hashicorp/remark-plugins'
import { RootDocsPath } from 'types/products'
import { remarkRewriteAssets } from 'lib/remark-plugins/remark-rewrite-assets'
import { remarkTfeContentExclusion } from 'lib/remark-plugins/remark-tfe-content-exclusion'

/**
 * Returns an instance of a FileSystemLoader for use in content repositories to read docs content from the
 * file system
 */
export function getDeployPreviewLoader({
	basePath,
	currentRootDocsPath,
	loaderOptions,
}: {
	basePath: string
	currentRootDocsPath: RootDocsPath
	loaderOptions: ConstructorParameters<typeof RemoteContentLoader>[0]
}) {
	// options needed to read content from the file system when running in preview mode

	const localContentDir = process.env.LOCAL_CONTENT_DIR
		? `${process.env.LOCAL_CONTENT_DIR}/${basePath}`
		: `../content/${basePath}`

	const navDataFile = `../data/${
		currentRootDocsPath.navDataPrefix ?? currentRootDocsPath.path
	}-nav-data.json`

	const fsOptions = {
		localContentDir,
		navDataFile,
	}

	/**
	 * These plugins are run during our content ETL process for remote content, but we need to run
	 * them when loading content directly from the filesystem.
	 */
	const remarkPluginsForFileSystemContent = [
		[
			includeMarkdown,
			{
				resolveMdx: true,
				resolveFrom: process.env.LOCAL_CONTENT_DIR
					? path.join(process.cwd(), process.env.LOCAL_CONTENT_DIR, 'partials')
					: path.join(process.cwd(), '..', 'content', 'partials'),
			},
		],
		paragraphCustomAlerts,
	]

	return new FileSystemLoader({
		...loaderOptions,
		...fsOptions,
		remarkPlugins(params, version) {
			const remarkPluginsFromExtraOptions =
				typeof loaderOptions.remarkPlugins === 'function'
					? loaderOptions.remarkPlugins(params)
					: loaderOptions.remarkPlugins

			// We have some custom handling for TF projects who have a few project-level variances
			// - images reside in `website/img` rather than `website/public` (Next.js serves static assets from `public`)
			// - TFE/C content exclusion markdown comments are used
			const remarkTerraformPlugins = []
			if (currentRootDocsPath.productSlugForLoader?.match(/^terraform/i)) {
				remarkTerraformPlugins.push(
					remarkRewriteAssets({
						product: currentRootDocsPath.productSlugForLoader,
						version: process.env.CURRENT_GIT_BRANCH,
						getAssetPathParts: (nodeUrl) => {
							// special case for CDKTF's relative paths ('./image.png')
							if (
								currentRootDocsPath.productSlugForLoader === 'terraform-cdk'
							) {
								return Array.isArray(params.page)
									? [
											'website/docs/cdktf',
											...params.page,
											nodeUrl.startsWith('.') ? `.${nodeUrl}` : `../${nodeUrl}`,
									  ]
									: ['website/docs/cdktf', nodeUrl]
							}
							// all other TF subprojects
							return ['website', nodeUrl]
						},
					})
				)
			}
			if (
				currentRootDocsPath.productSlugForLoader?.match(
					/(terraform-docs-common|ptfe-releases)/i
				)
			) {
				remarkTerraformPlugins.push([remarkTfeContentExclusion, { version }])
			}

			// The order here is intentional. remarkPluginsForFileSystemContent ensures that partials are resolved and the content is close to its final structure before we do things like apply link rewrites
			return [
				...remarkTerraformPlugins,
				...remarkPluginsForFileSystemContent,
				...remarkPluginsFromExtraOptions,
			]
		},
	})
}
