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
import Footer from 'components/_proxied-dot-io/nomad/footer'
import ProductSubnav from 'components/_proxied-dot-io/nomad/subnav'
import productData from 'data/nomad.json'
import query from './query.graphql'

interface Props {
	/**
	 * Data from data which may contain nav items for the use cases nav
	 */
	data: {
		useCaseNavItems: Array<{ url: string; text: string }>
	}
	/** Page contents to render in the layout */
	children: React.ReactNode
}

const { ConsentManager, openConsentManager } = createConsentManager({
	segmentWriteKey: productData.analyticsConfig.segmentWriteKey,
	preset: 'oss',
	otherServices: [...localConsentManagerServices],
})

function NomadIoLayout({ children, data }: Props): React.ReactElement {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID_NOMAD,
		includedDomains: productData.analyticsConfig.includedDomains,
	})
	const { themeClass } = useProductMeta(productData.name as Products)
	const { useCaseNavItems } = data

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
				<ProductMetaProvider product={productData.slug as Products}>
					{productData.alertBannerActive && (
						<AlertBanner
							{...productData.alertBanner}
							product={productData.slug as Products}
							hideOnMobile
						/>
					)}
					<ProductSubnav
						menuItems={[
							{ text: 'Overview', url: '/', type: 'inbound' },
							{
								text: 'Use Cases',
								submenu: [
									...useCaseNavItems.map((item) => {
										return {
											text: item.text,
											url: `/use-cases/${item.url}`,
										}
									}),
								].sort((a, b) => a.text.localeCompare(b.text)),
							},
							{
								text: 'Enterprise',
								url: 'https://www.hashicorp.com/products/nomad/',
								type: 'outbound',
							},
							'divider',
							{
								text: 'Tutorials',
								url: 'https://learn.hashicorp.com/nomad',
								type: 'outbound',
							},
							{
								text: 'Docs',
								url: 'https://developer.hashicorp.com/nomad/docs',
								type: 'inbound',
							},
							{
								text: 'API',
								url: 'https://developer.hashicorp.com/nomad/api-docs',
								type: 'inbound',
							},
							{
								text: 'Plugins',
								url: 'https://developer.hashicorp.com/nomad/plugins',
								type: 'inbound',
							},
							{
								text: 'Tools',
								url: 'https://developer.hashicorp.com/nomad/tools',
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
				</ProductMetaProvider>
			</Min100Layout>
			<ConsentManager />
		</>
	)
}

NomadIoLayout.rivetParams = {
	query,
	dependencies: [],
}

export default NomadIoLayout
