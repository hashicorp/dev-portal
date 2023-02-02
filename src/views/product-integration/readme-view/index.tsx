import { BreadcrumbLink } from 'components/breadcrumb-bar'
import DevDotContent from 'components/dev-dot-content'
import { TryHcpCalloutSidecarPlacement } from 'components/try-hcp-callout/components'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import { getIntegrationUrl } from 'lib/integrations'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'
import s from './style.module.css'

export interface ProductIntegrationReadmeViewProps {
	product: ProductData
	integration: Integration
	activeRelease: Release
	serializedREADME: MDXRemoteSerializeResult
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationReadmeView({
	product,
	integration,
	activeRelease,
	breadcrumbLinks,
	serializedREADME,
}: ProductIntegrationReadmeViewProps) {
	return (
		<ProductIntegrationLayout
			title="README"
			className={s.readmeView}
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				const isLatest = version === integration.versions[0]
				return isLatest
					? getIntegrationUrl(integration)
					: getIntegrationUrl(integration, version)
			}}
			sidecarSlot={<TryHcpCalloutSidecarPlacement productSlug={product.slug} />}
		>
			<DevDotContent mdxRemoteProps={serializedREADME} />
		</ProductIntegrationLayout>
	)
}
ProductIntegrationReadmeView.contentType = 'integrations'
