/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// View
import ProductDownloadsView from 'views/product-downloads-view'
// Components
import { InstallCallout } from './components'
import InlineAlert from 'components/inline-alert'
import InlineLink from 'components/inline-link'
import { IconInfo16 } from '@hashicorp/flight-icons/svg-react/info-16'
// Types
import { InstallProps } from './components/install-callout/types'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'
import s from './download.module.css'
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
	desktopClientProps: InstallProps
	boundaryInstallerProps: InstallProps
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
						<InstallCallout
							headingData={SHARED_HEADINGS.desktopClient}
							customInstallProps={desktopClientProps}
						>
							<InlineAlert
								className={s.alert}
								color="neutral"
								title="Note"
								description={
									<>
										You can find previous versions of the Desktop Client on the{' '}
										<InlineLink
											href="https://releases.hashicorp.com/boundary-desktop"
											textSize={200}
										>
											Desktop Client releases page.
										</InlineLink>
									</>
								}
								icon={<IconInfo16 className={s.cardIcon} />}
							/>
						</InstallCallout>
						<InstallCallout
							cardClassName={s.lastCard}
							headingData={SHARED_HEADINGS.installer}
							customInstallProps={boundaryInstallerProps}
						/>
					</>
				),
			}}
		/>
	)
}

export default BoundaryDownloadsView
