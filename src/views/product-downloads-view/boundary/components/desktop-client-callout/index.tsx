// Components
import Card from 'components/card'
import Heading from 'components/heading'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
// Types
import { DesktopClientProps, ReleaseBuild } from './types'
// Local imports
import { operatingSystemIcons } from '../'
import { getFileExtension, humanArch } from './helpers'
// Styles
import s from './desktop-client-callout.module.css'

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
		<Card elevation="low">
			<Heading className={s.heading} level={2} size={200} weight="semibold">
				{`Desktop Client v${latestVersion}`}
			</Heading>
			<IconCardLinkGridList
				fixedColumns={3}
				gridGap="16px"
				cards={builds.map(({ os, url, filename, arch }: ReleaseBuild) => {
					const icon = operatingSystemIcons[os] || <IconDownload16 />
					const text = `.${getFileExtension(filename)} (${humanArch(arch)})`
					return { icon, url, text }
				})}
			/>
		</Card>
	)
}

export { DesktopClientCallout }
