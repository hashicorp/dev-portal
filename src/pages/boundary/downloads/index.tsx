import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
// Data
import boundaryData from 'data/boundary.json'
// Components
import Heading from 'components/heading'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
// Utils
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
// View
import ProductDownloadsView from 'views/product-downloads-view'
// Server
import { generateGetStaticProps } from 'views/product-downloads-view/server'
// Types
import { ProductData } from 'types/products'
import { ProductDownloadsViewProps } from 'views/product-downloads-view/types'
// Styles
import s from './boundary-downloads-desktop-client-callout.module.css'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import Card from 'components/card'
import { OperatingSystem } from '@hashicorp/react-product-downloads-page'

/**
 * The Desktop Client CTA uses separate release data, fetched with this slug.
 */
const DESKTOP_CLIENT_RELEASE_SLUG = 'boundary-desktop'

/**
 * TODO: move types to separate file
 */
interface ReleaseBuild {
	os: OperatingSystem
	url: string
	filename: string
	arch: string
}
interface DesktopClientProps extends Record<string, $TSFixMe> {
	latestVersion: string
	builds: ReleaseBuild[]
}

/**
 * TODO: move osIconDict to separate file
 */
const osIconDict: Record<OperatingSystem, ReactElement> = {
	darwin: <IconDownload16 />, // TODO: replace with macOS icon
	linux: <IconDownload16 />, // TODO: replace with linux icon
	windows: <IconDownload16 />, // TODO: replace with windows icon
	/**
	 * Note: remaining OS use generic download icon, for now,
	 * as they're not displayed in any current context,
	 * and sourcing these icons is outside the scope of current work.
	 */
	freebsd: <IconDownload16 />,
	openbsd: <IconDownload16 />,
	netbsd: <IconDownload16 />,
	archlinux: <IconDownload16 />,
}

/**
 * TODO: move to helper functions file
 */
function humanArch(arch: string) {
	if (arch === '386') {
		return '32-bit'
	}
	if (arch === 'amd64') {
		return '64-bit'
	}
	return arch
}

/**
 * TODO: move to helper functions file
 */
function getFileExtension(filename: string) {
	return filename.substring(filename.lastIndexOf('.') + 1, filename.length)
}

function BoundaryDownloadsDesktopClientCallout({
	desktopClientProps,
}: {
	desktopClientProps: DesktopClientProps
}) {
	const { latestVersion, builds } = desktopClientProps

	return (
		<>
			<Card elevation="low">
				<Heading
					className={s.heading}
					id="featured-tutorials"
					level={2}
					size={300}
					weight="bold"
				>
					{`Desktop Client v${latestVersion}`}
				</Heading>
				<IconCardLinkGridList
					cards={builds.map(({ os, url, filename, arch }: ReleaseBuild) => {
						const icon = osIconDict[os] || <IconDownload16 />
						const text = `.${getFileExtension(filename)} (${humanArch(arch)})`
						return { icon, url, text }
					})}
					gridGap="16px"
				/>
			</Card>
			<pre className={s.devPre}>
				<code>{JSON.stringify({ desktopClientProps }, null, 2)}</code>
			</pre>
		</>
	)
}

/**
 * TODO: move to views/product-downloads-view/boundary
 */
function BoundaryDownloadsPage({
	desktopClientProps,
	...baseProps
}: ProductDownloadsViewProps & {
	desktopClientProps: DesktopClientProps
}) {
	return (
		<ProductDownloadsView
			{...baseProps}
			merchandisingSlot={
				<BoundaryDownloadsDesktopClientCallout
					desktopClientProps={desktopClientProps}
				/>
			}
		/>
	)
}

const getStaticProps: GetStaticProps = async () => {
	/**
	 * Get the base static props for the view,
	 * which fetches the `boundary` release data.
	 */
	const { props: baseProps, ...restBaseResult } = await generateGetStaticProps(
		boundaryData as ProductData
	)()

	/**
	 * Get additional release data for the Boundary Desktop Client,
	 * which we need to display the download CTA in the "merchandising" slot.
	 */
	const { props: releaseProps } = await generateReleaseStaticProps(
		DESKTOP_CLIENT_RELEASE_SLUG
	)
	/**
	 * For our Desktop Client CTA,
	 * we only need the latest version number & associated builds.
	 */
	const { releases, latestVersion } = releaseProps
	const desktopClientProps: DesktopClientProps = {
		latestVersion,
		builds: releases.versions[latestVersion].builds,
	}

	/**
	 * Return the combined baseProps and Desktop Client data
	 */
	const finalProps = { ...baseProps, desktopClientProps }
	return { props: finalProps, ...restBaseResult }
}

export { getStaticProps }
export default BoundaryDownloadsPage
