/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import PackerIoLayout from 'layouts/_proxied-dot-io/packer'
import ProductDownloadsPage from '@hashicorp/react-product-downloads-page'
import { generateStaticProps } from 'lib/fetch-release-data'
import s from './style.module.css'

function DownloadsPage({ product, releases, latestVersion }) {
	return (
		<ProductDownloadsPage
			product={product}
			releases={releases}
			latestVersion={latestVersion}
			getStartedDescription="Follow step-by-step tutorials on the essentials of Packer."
			getStartedLinks={[
				{
					label: 'View all Packer tutorials',
					href: 'https://developer.hashicorp.com/packer/tutorials',
				},
			]}
			logo={
				<img
					className={s.logo}
					alt="Nomad"
					src={require('@hashicorp/mktg-logos/product/packer/primary/color.svg')}
				/>
			}
			tutorialLink={{
				href: 'https://developer.hashicorp.com/packer/tutorials',
				label: 'View Tutorials at HashiCorp Learn',
			}}
		/>
	)
}

export const getStaticProps = () => generateStaticProps('packer')

DownloadsPage.layout = PackerIoLayout
export default DownloadsPage
