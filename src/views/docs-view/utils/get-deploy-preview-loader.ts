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

	console.log('[Deploy Preview Loader]\n', process.cwd(), basePath, fsOptions)

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
		remarkPlugins(params) {
			const remarkPluginsFromExtraOptions =
				typeof loaderOptions.remarkPlugins === 'function'
					? loaderOptions.remarkPlugins(params)
					: loaderOptions.remarkPlugins

			return [
				...remarkPluginsFromExtraOptions,
				...remarkPluginsForFileSystemContent,
			]
		},
	})
}
