/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Data
import boundaryData from 'data/boundary.json'
// Server
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { generateGetStaticProps } from 'views/product-downloads-view/server'
// Types
import { GetStaticProps } from 'next'
import { ProductData } from 'types/products'
import { ProductDownloadsViewStaticProps } from 'views/product-downloads-view/types'
import { InstallProps } from './components/install-callout/types'

/**
 * The Desktop Client CTA uses separate release data, fetched with this slug.
 */
const DESKTOP_CLIENT_RELEASE_SLUG = 'boundary-desktop'

/**
 * The Boundary installer CTA uses separate release data, fetched with this slug.
 */
const BOUNDARY_INSTALLER_RELEASE_SLUG = 'boundary-installer'

/**
 * Boundary downloads static props extend the base product downloads view props,
 * with props for the desktop client CTA.
 */
interface BoundaryDownloadsPageProps extends ProductDownloadsViewStaticProps {
	desktopClientProps: InstallProps
	boundaryInstallerProps: InstallProps
}

/**
 * Factory that returns a getStaticProps function for the Boundary downloads page.
 * Pass `isEnterpriseMode: true` to get enterprise release data.
 */
const createGetStaticProps = (isEnterpriseMode = false): GetStaticProps<BoundaryDownloadsPageProps> => async () => {
	/**
	 * Get the base static props for the view,
	 * which fetches the `boundary` release data.
	 */
	const { props: baseProps, ...restBaseResult } = await generateGetStaticProps(
		boundaryData as ProductData,
		{ isEnterpriseMode }
	)()

	/**
	 * Get additional release data for the Boundary Desktop Client,
	 * which we need to display the download CTA in the "merchandising" slot.
	 */
	const { props: desktopReleaseProps } = await generateReleaseStaticProps(
		DESKTOP_CLIENT_RELEASE_SLUG
	)
	/**
	 * For our Desktop Client CTA,
	 * we only need the latest version number & associated builds.
	 */
	const { releases: desktopReleases, latestVersion: latestDesktopVersion } =
		desktopReleaseProps
	const desktopClientProps: InstallProps = {
		latestVersion: latestDesktopVersion,
		builds: desktopReleases.versions[latestDesktopVersion].builds,
	}

	/**
	 * Get additional release data for the Boundary Installer,
	 * which we need to display the download CTA below the Desktop Client slot.
	 */
	const { props: installerReleaseProps } = await generateReleaseStaticProps(
		BOUNDARY_INSTALLER_RELEASE_SLUG
	)
	/**
	 * For our Boundary Installer CTA,
	 * we only need the latest version number & associated builds.
	 */
	const { releases: installerReleases, latestVersion: latestInstallerVersion } =
		installerReleaseProps
	const boundaryInstallerProps: InstallProps = {
		latestVersion: latestInstallerVersion,
		builds: installerReleases.versions[latestInstallerVersion].builds,
	}

	/**
	 * Return the combined baseProps and Desktop Client data
	 */
	const finalProps = {
		...baseProps,
		desktopClientProps,
		boundaryInstallerProps,
	}
	return { props: finalProps, ...restBaseResult }
}

const getStaticProps = createGetStaticProps(false)
const getEnterpriseStaticProps = createGetStaticProps(true)

export { getStaticProps, getEnterpriseStaticProps }
