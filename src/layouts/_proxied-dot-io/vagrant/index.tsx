/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import HashiHead from '@hashicorp/react-head'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, { Products } from '@hashicorp/platform-product-meta'
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import localConsentManagerServices from 'lib/consent-manager-services/io-sites'
import { ProductMetaProvider } from '@hashicorp/platform-product-meta'
// product-specific layout elements
import Footer from 'components/_proxied-dot-io/vagrant/footer'
import ProductSubnav from 'components/_proxied-dot-io/vagrant/subnav'
import productData from 'data/vagrant.json'
import query from './query.graphql'

type UseCase = { slug: string; text: string }

interface Props {
	children: React.ReactChildren
	data: {
		vagrantNav: {
			useCases: Array<UseCase>
		}
	}
}

const { ConsentManager, openConsentManager } = createConsentManager({
	segmentWriteKey: productData.analyticsConfig.segmentWriteKey,
	preset: 'oss',
	otherServices: [...localConsentManagerServices],
})

function VagrantIoLayout({ children, data }: Props): React.ReactElement {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID_VAGRANT,
		includedDomains: productData.analyticsConfig.includedDomains,
	})
	const { themeClass } = useProductMeta(productData.name as Products)
	const { vagrantNav } = data ?? {}

	return (
		<>
			<HashiHead
				title={productData.metadata.title}
				pageName={productData.metadata.title}
				siteName={productData.metadata.title}
				description={productData.metadata.description}
				image={productData.metadata.image}
				icon={productData.metadata.icon}
			/>

			<ProductMetaProvider product={productData.slug as Products}>
				<Min100Layout
					footer={<Footer openConsentManager={openConsentManager} />}
				>
					{productData.alertBannerActive && (
						<AlertBanner
							{...productData.alertBanner}
							product={productData.slug as Products}
							hideOnMobile
						/>
					)}
					<ProductSubnav
						menuItems={[
							{
								text: 'Overview',
								url: '/',
								type: 'inbound',
							},
							'divider',
							vagrantNav.useCases.length > 0
								? {
										text: 'Use Cases',
										submenu: [
											...vagrantNav.useCases.map((item: UseCase) => {
												return {
													text: item.text,
													url: `/use-cases/${item.slug}`,
												}
											}),
										],
								  }
								: undefined,
							{
								text: 'Intro',
								url: '/intro',
								type: 'inbound',
							},
							{
								text: 'Docs',
								url: '/docs',
								type: 'inbound',
							},
							{
								text: 'Community',
								url: '/community',
								type: 'inbound',
							},
						].filter(Boolean)}
					/>
					<div className={themeClass}>{children}</div>
				</Min100Layout>
				<ConsentManager />
			</ProductMetaProvider>
		</>
	)
}

VagrantIoLayout.rivetParams = {
	query,
	dependencies: [],
}

export default VagrantIoLayout
