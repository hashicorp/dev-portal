import { GetStaticProps } from 'next'
// Data
import boundaryData from 'data/boundary.json'
// Components
import Heading from 'components/heading'
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
import viewStyles from 'views/product-downloads-view/product-downloads-view.module.css'
import s from './boundary-downloads-desktop-client-callout.module.css'

/**
 * TODO: move this to separate types file, maybe? Or not.
 */
interface DesktopClientProps extends Record<string, $TSFixMe> {
	latestVersion: string
}

function BoundaryDownloadsDesktopClientCallout({
	desktopClientProps,
}: {
	desktopClientProps: DesktopClientProps
}) {
	/**
	 * TODO: finish implementation & styling
	 */
	const { latestVersion } = desktopClientProps

	return (
		<>
			<Heading
				className={viewStyles.heading2}
				id="featured-tutorials"
				level={2}
				size={300}
				weight="bold"
			>
				{`Desktop Client v${latestVersion}`}
			</Heading>
			<pre className={s.devPre}>
				<code>{JSON.stringify({ desktopClientProps }, null, 2)}</code>
			</pre>
		</>
	)
}

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
		'boundary-desktop'
	)
	/**
	 * Format the latest release data for display as a CTA.
	 */
	const { releases, latestVersion } = releaseProps
	const desktopClientProps: DesktopClientProps = {
		name: releases.name,
		latestVersion,
		latestVersionData: releases.versions[latestVersion],
	}

	/**
	 * Return the combined baseProps and Desktop Client data
	 */
	const finalProps = { ...baseProps, desktopClientProps }
	return { props: finalProps, ...restBaseResult }
}

export { getStaticProps }
export default BoundaryDownloadsPage
