import React from 'react'
import HashiHead from '@hashicorp/react-head'
import AlertBanner from '@hashicorp/react-alert-banner'
import Min100Layout from '@hashicorp/react-min-100-layout'
import useProductMeta, {
	ProductMetaProvider,
	Products,
} from '@hashicorp/platform-product-meta'
import usePageviewAnalytics from '@hashicorp/platform-analytics'
import createConsentManager from '@hashicorp/react-consent-manager/loader'
import localConsentManagerServices from 'lib/consent-manager-services/io-sites'
// product-specific layout elements
import Footer from 'components/_proxied-dot-io/packer/footer'
import ProductSubnav from 'components/_proxied-dot-io/packer/subnav'
import productData from 'data/packer.json'
import query from './query.graphql'

interface Props {
	/**
	 * Data from data which may contain nav items for the use cases nav
	 */
	data: {
		packerNav: {
			useCases: Array<{ url: string; text: string }>
		}
	}
	/** Page contents to render in the layout */
	children: React.ReactNode
}

const { ConsentManager, openConsentManager } = createConsentManager({
	segmentWriteKey: productData.analyticsConfig.segmentWriteKey,
	preset: 'oss',
	otherServices: [...localConsentManagerServices],
})

function PackerIoLayout({ children, data }: Props): React.ReactElement {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID_PACKER,
		includedDomains: productData.analyticsConfig.includedDomains,
	})
	const { themeClass } = useProductMeta(productData.name as Products)
	const { packerNav } = data ?? {}

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

			<Min100Layout footer={<Footer openConsentManager={openConsentManager} />}>
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
						packerNav.useCases.length > 0
							? {
									text: 'Use Cases',
									submenu: [
										...packerNav.useCases.map((item) => {
											return {
												text: item.text,
												url: `/use-cases/${item.url}`,
											}
										}),
									].sort((a, b) => a.text.localeCompare(b.text)),
							  }
							: undefined,
						{
							text: 'Tutorials',
							url: 'https://learn.hashicorp.com/packer',
							type: 'inbound',
						},
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
							text: 'Guides',
							url: '/guides',
							type: 'inbound',
						},
						{
							text: 'Plugins',
							url: '/plugins',
							type: 'inbound',
						},
						{
							text: 'Community',
							url: '/community',
							type: 'inbound',
						},
					]}
				/>
				<div className={themeClass}>{children}</div>
			</Min100Layout>
			<ConsentManager />
		</>
	)
}

PackerIoLayout.rivetParams = {
	query,
	dependencies: [],
}

export default PackerIoLayout
