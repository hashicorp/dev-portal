/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Data
import boundaryData from 'data/boundary.json'
// Server
import { generateStaticProps as generateReleaseStaticProps } from 'lib/fetch-release-data'
import { generateGetStaticProps } from 'views/product-install-view/server'
// Types
import { GetStaticProps } from 'next'
import { ProductData } from 'types/products'
import { ProductInstallViewStaticProps } from 'views/product-install-view/types'
import { DesktopClientProps } from './components/desktop-client-callout/types'

/**
 * The Desktop Client CTA uses separate release data, fetched with this slug.
 */
const DESKTOP_CLIENT_RELEASE_SLUG = 'boundary-desktop'

/**
 * Boundary downloads static props extend the base product downloads view props,
 * with props for the desktop client CTA.
 */
interface BoundaryInstallPageProps extends ProductInstallViewStaticProps {
	desktopClientProps: DesktopClientProps
}

/**
 * Get static props for the Boundary downloads page.
 */
const getStaticProps: GetStaticProps<BoundaryInstallPageProps> = async () => {
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
