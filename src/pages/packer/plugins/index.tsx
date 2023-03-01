/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DocsView from 'views/docs-view'
// Imports below are used server-side
import { getRootDocsPathGenerationFunctions } from 'views/docs-view/utils/get-root-docs-path-generation-functions'
import { appendRemotePluginsNavData } from 'components/_proxied-dot-io/packer/remote-plugin-docs/server'
import prepareNavDataForClient from 'layouts/sidebar-sidecar/utils/prepare-nav-data-for-client'
import { isDeployPreview } from 'lib/env-checks'

/**
 * Path relative to the `website` directory of the Packer GitHub repo.
 *
 * Note that these are not currently used, as we don't yet support local
 * preview for the dev dot UI. They've been retained to avoid too
 * broad of a refactor to utilities shared with dot-io (where local
 * preview is actively supported).
 */
const remotePluginsFile = 'data/plugins-manifest.json'
const contentBranch = 'stable-website'

/**
 * Since this /plugins landing page does use content from our API,
 * we can use the same getStaticProps function as all other Dev Dot docs routes,
 * with some modifications for the sidebar data.
 *
 * Note: this means we end up sourcing the .mdx for this page from
 * the latest content according to our content API. This is not
 * guaranteed to match the `contentBranch` we use for remote plugins data.
 */
const { getStaticProps: baseGetStaticProps } =
	getRootDocsPathGenerationFunctions('packer', 'plugins', {
		hideVersionSelector: true,
	})

/**
 * We tack on some extra plugin data to the result of the base getStaticProps,
 * in order to get the sidebar on this page showing links to all remote plugins.
 */
async function getStaticProps(ctx) {
	const staticProps = await baseGetStaticProps({ params: {}, ...ctx })

	/**
	 * Merge in remote plugin data sidebar items
	 */
	if ('props' in staticProps) {
		// Partial nav data is provided from base getStaticProps, in menuItems
		const partialNavData =
			staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems

		let rawNavData = partialNavData
		if (!isDeployPreview() || isDeployPreview('packer')) {
			// Fetch and merge in remote plugins nav data with the partialNavData
			rawNavData = await appendRemotePluginsNavData(
				remotePluginsFile,
				partialNavData,
				'',
				contentBranch
			)
		}

		// Prepare nav data for client (such as adding `fullPath`)
		const { preparedItems: navData } = await prepareNavDataForClient({
			basePaths: ['packer', 'plugins'],
			nodes: rawNavData,
		})

		// Replace our original navData with our prepared navData
		staticProps.props.layoutProps.sidebarNavDataLevels[2].menuItems = navData

		// Long-form content pages use a narrower main area width
		staticProps.props.layoutProps.mainWidth = 'narrow'
	}

	/**
	 * Return the modified static props
	 */
	return staticProps
}

// Export getStatic functions
export { getStaticProps }

export default DocsView
