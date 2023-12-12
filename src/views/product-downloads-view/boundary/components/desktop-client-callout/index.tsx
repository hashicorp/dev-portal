/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Components
import Card from 'components/card'
import CardWithLink from 'views/product-downloads-view/components/card-with-link'
import MobileDownloadStandaloneLink from 'components/mobile-download-standalone-link'
import Heading from 'components/heading'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
// Types
import { DesktopClientProps, ReleaseBuild } from './types'
// Local imports
import { operatingSystemIcons } from '../'
import { getFileExtension, humanArch } from './helpers'
// Styles
import s from './desktop-client-callout.module.css'
import { ContentWithPermalink } from 'views/open-api-docs-view/components/content-with-permalink'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import { BoundaryDesktopClient } from 'views/product-downloads-view/components/downloads-section/types'

/**
 * Render a callout to download the Boundary Desktop Client.
 */
function DesktopClientCallout({
	desktopClientProps,
}: {
	desktopClientProps: DesktopClientProps
}) {
	const { latestVersion, builds } = desktopClientProps
	return (
		<Card elevation="base">
			<ContentWithPermalink
				className={s.headingContainer}
				id={'Desktop-client' as BoundaryDesktopClient}
				ariaLabel={`Desktop Client v${latestVersion}`}
			>
				<Heading
					className={viewStyles.scrollHeading}
					level={2}
					size={400}
					id={'Desktop-client' as BoundaryDesktopClient}
					weight="bold"
				>
					{`Desktop Client v${latestVersion}`}
				</Heading>
			</ContentWithPermalink>
			<div className={s.downloadContainer}>
				{builds.map(({ os, url, filename, arch }: ReleaseBuild) => (
					<CardWithLink
						className={s.downloadCard}
						key={filename}
						icon={operatingSystemIcons[os] || <IconDownload16 />}
						heading={`.${getFileExtension(filename)} (${humanArch(arch)})`}
						link={
							<MobileDownloadStandaloneLink
								ariaLabel={`download .${getFileExtension(
									filename
								)}, architecture ${arch}`}
								href={url}
							/>
						}
					/>
				))}
			</div>
		</Card>
	)
}

export { DesktopClientCallout }
