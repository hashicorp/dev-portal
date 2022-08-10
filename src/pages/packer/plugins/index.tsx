import DocsView from 'views/docs-view'
// Imports below are used server-side
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'
import { appendRemotePluginsNavData } from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import { isObject, traverse } from 'lib/traverse'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'

/**
 * Path to the plugins manifest relative to the `website` directory
 * of the `hashicorp/packer` GitHub repo.
 *
 * Note: local preview is not yet supported for the Dev Dot UI,
 * we pass remotePluginsFile to avoid having to refactor
 * appendRemotePluginsNavData (for now).
 */
const remotePluginsFile = 'data/plugins-manifest.json'

// We use the same getStaticProps function as all other Dev Dot docs routes
const { getStaticProps: baseGetStaticProps } =
	getRootDocsPathGenerationFunctions('packer', 'plugins')

/**
 * We tack on some extra plugin data to the result of the base getStaticProps,
 * in order to get the sidebar on this page showing links to all remote plugins.
 */
async function getStaticProps(ctx) {
	const staticProps = await baseGetStaticProps({ params: {}, ...ctx })
	// Merge in remote plugin data sidebar items
	if ('props' in staticProps) {
		// Partial nav data is provided from base getStaticProps
		const partialNavData =
			staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems
		// We fetch and merge in remote plugins nav data
		const rawNavData = await appendRemotePluginsNavData(
			remotePluginsFile,
			partialNavData,
			''
		)
		// Prepare nav data for client, eg adding `fullPath`
		const { preparedItems: navData } = prepareNavDataForClient({
			basePaths: ['packer', 'plugins'],
			nodes: rawNavData,
		})

		// Replace our original navData with our prepared navData
		staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems = navData
	}
	// Return the modified static props
	return staticProps
}

// Export getStatic functions
export { getStaticProps }

export default DocsView
