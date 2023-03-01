/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import BoundaryIoLayout from 'layouts/_proxied-dot-io/boundary'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import MerchDesktopClient from 'components/_proxied-dot-io/boundary/merch-desktop-client'
import styles from './style.module.css'

const DESKTOP_BINARY_SLUG = 'boundary-desktop'

function DownloadsPage({ binaryReleases, desktopReleases }) {
	return (
		<ProductDownloadsPage
			releases={binaryReleases.releases}
			latestVersion={binaryReleases.latestVersion}
			getStartedLinks={[
				{
					label: 'Install Boundary',
					href: 'https://developer.hashicorp.com/boundary/tutorials/oss-getting-started/oss-getting-started-install',
				},
				{
					label: 'Introduction to Boundary',
					href: 'https://developer.hashicorp.com/boundary/tutorials/oss-getting-started/oss-getting-started-intro',
				},
				{
					label: 'Start a Development Environment',
					href: 'https://developer.hashicorp.com/boundary/tutorials/oss-getting-started/oss-getting-started-dev',
				},
			]}
			logo={
				<img
					className={styles.logo}
					alt="Boundary"
					src={require('@hashicorp/mktg-logos/product/boundary/primary/color.svg')}
				/>
			}
			product="boundary"
			tutorialLink={{
				label: 'View Tutorials',
				href: 'https://developer.hashicorp.com/boundary/tutorials/oss-getting-started/oss-getting-started-install',
			}}
			merchandisingSlot={
				<MerchDesktopClient
					version={desktopReleases.latestVersion}
					releases={desktopReleases.releases}
				/>
			}
		/>
	)
}

export async function getStaticProps() {
	const [binaryReleases, desktopReleases] = await Promise.all([
		generateStaticProps('boundary'),
		generateStaticProps(DESKTOP_BINARY_SLUG),
	])

	return {
		revalidate: binaryReleases.revalidate,
		props: {
			binaryReleases: binaryReleases.props,
			desktopReleases: desktopReleases.props,
		},
	}
}

DownloadsPage.layout = BoundaryIoLayout
export default DownloadsPage
