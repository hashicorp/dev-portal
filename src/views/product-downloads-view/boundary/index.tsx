/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import ProductDownloadsView from 'views/product-downloads-view'
// Components
import { DesktopClientCallout } from './components'
import { BoundaryInstallerCallout } from './components'
// Types
import { DesktopClientProps } from './components/desktop-client-callout/types'
import { BoundaryInstallerProps } from './components/boundary-installer-callout/types'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'

/**
 * Matching heading data is needed between the sidebar nav links and the
 * heading `id` itself. We declare it here so we can share it.
 */
const SHARED_HEADINGS = {
	desktopClient: {
		id: 'desktop-client',
		text: 'Desktop Client',
	},
	installer: {
		id: 'installer',
		text: 'Boundary Installer',
	},
}

/**
 * Render the Boundary downloads page.
 */
function BoundaryDownloadsView({
	desktopClientProps,
	boundaryInstallerProps,
	...baseProps
}: ProductDownloadsViewProps & {
	desktopClientProps: DesktopClientProps
	boundaryInstallerProps: BoundaryInstallerProps
}) {
	const { pageContent, ...restBaseProps } = baseProps
	const additionalDownloadItems = [
		{
			title: SHARED_HEADINGS.desktopClient.text,
			fullPath: `#${SHARED_HEADINGS.desktopClient.id}`,
		},
		{
			title: SHARED_HEADINGS.installer.text,
			fullPath: `#${SHARED_HEADINGS.installer.id}`,
		},
	]

	return (
		<ProductDownloadsView
			{...restBaseProps}
			pageContent={{ ...pageContent, additionalDownloadItems }}
			merchandisingSlot={{
				position: 'middle',
				slot: (
					<>
						<DesktopClientCallout
							headingData={SHARED_HEADINGS.desktopClient}
							desktopClientProps={desktopClientProps}
						/>
						<BoundaryInstallerCallout
							headingData={SHARED_HEADINGS.installer}
							installerProps={boundaryInstallerProps}
						/>
					</>
				),
			}}
		/>
	)
}

export default BoundaryDownloadsView
