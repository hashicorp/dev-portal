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
import BasicFooter from 'components/_proxied-dot-io/waypoint/basic-footer'
import ProductSubnav from 'components/_proxied-dot-io/waypoint/subnav'
import productData from 'data/waypoint.json'
import query from './query.graphql'

const { ConsentManager, openConsentManager } = createConsentManager({
	segmentWriteKey: productData.analyticsConfig.segmentWriteKey,
	preset: 'oss',
	otherServices: [...localConsentManagerServices],
})

type UseCase = { url: string; text: string }

interface Props {
	children: React.ReactChildren
	data: {
		waypointNav: {
			useCases: Array<UseCase>
		}
	}
}

function WaypointIoLayout({ children, data }: Props): React.ReactElement {
	usePageviewAnalytics({
		siteId: process.env.NEXT_PUBLIC_FATHOM_SITE_ID_WAYPOINT,
		includedDomains: productData.analyticsConfig.includedDomains,
	})
	const { themeClass } = useProductMeta(productData.name as Products)
	const { waypointNav } = data ?? {}

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

			<Min100Layout
				footer={<BasicFooter openConsentManager={openConsentManager} />}
			>
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
							{ text: 'Overview', url: '/' },
							waypointNav.useCases.length > 0
								? {
										text: 'Use Cases',
										submenu: [
											...waypointNav.useCases.map((item: UseCase) => {
												return {
													text: item.text,
													url: `/use-cases/${item.url}`,
												}
											}),
										],
								  }
								: undefined,
							{
								text: 'Enterprise',
								url: 'https://www.hashicorp.com/products/consul/?utm_source=oss&utm_medium=header-nav&utm_campaign=consul',
								type: 'outbound',
							},
							'divider',
							{
								text: 'Tutorials',
								url: 'https://learn.hashicorp.com/consul',
								type: 'outbound',
							},
							{
								text: 'Docs',
								url: '/docs',
								type: 'inbound',
							},
							{
								text: 'API',
								url: '/api-docs',
								type: 'inbound',
							},
							{
								text: 'CLI',
								url: '/commands',
								type: 'inbound,',
							},
							{
								text: 'Community',
								url: '/community',
								type: 'inbound',
							},
						].filter(Boolean)}
					/>
					<div className={themeClass}>{children}</div>
				</ProductMetaProvider>
			</Min100Layout>
			<ConsentManager />
		</>
	)
}

WaypointIoLayout.rivetParams = {
	query,
	dependencies: [],
}

export default WaypointIoLayout
