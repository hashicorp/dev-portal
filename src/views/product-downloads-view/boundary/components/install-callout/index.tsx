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
import { InstallProps, ReleaseBuild } from './types'
// Local imports
import { operatingSystemIcons } from '..'
import { getFileExtension, humanArch } from '../helpers'
// Styles
import s from './install-callout.module.css'
import { ContentWithPermalink } from 'views/open-api-docs-view-v2/components/content-with-permalink'
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'

/**
 * Render a callout to download the Boundary Desktop Client.
 */
function InstallCallout({
	customInstallProps,
	headingData,
	cardClassName,
}: {
	customInstallProps: InstallProps
	/** We link to this heading from the side nav, so we've lifted up its data */
	headingData: {
		id: string
		text: string
	}
	cardClassName?: string
}) {
	const { latestVersion, builds } = customInstallProps
	return (
		<Card elevation="base" className={cardClassName}>
			<ContentWithPermalink
				className={s.headingContainer}
				id={headingData.id}
				ariaLabel={`${headingData.text} v${latestVersion}`}
			>
				<Heading
					className={viewStyles.scrollHeading}
					level={2}
					size={400}
					id={headingData.id}
					weight="bold"
				>
					{`${headingData.text} v${latestVersion}`}
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

export { InstallCallout }
