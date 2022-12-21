import { BreadcrumbLink } from 'components/breadcrumb-bar'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release, ReleaseComponent } from 'lib/integrations-api-client/release'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'
// TODO, move this imported component
import ComponentTabContent from 'views/product-integration-old/components/component-tab-content'

interface ProductIntegrationComponentViewProps {
	product: ProductData
	integration: Integration
	activeRelease: Release
	component: ReleaseComponent
	serializedREADME?: MDXRemoteSerializeResult
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationComponentView({
	product,
	integration,
	activeRelease,
	component,
	serializedREADME,
	breadcrumbLinks,
}: ProductIntegrationComponentViewProps) {
	return (
		<ProductIntegrationLayout
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				const versionString =
					version === integration.versions[0] ? 'latest' : version
				return `/${product.slug}/integrations/${integration.slug}/${versionString}/components/${component.component.slug}`
			}}
		>
			<ComponentTabContent
				component={{
					...component,
					readmeMdxSource: serializedREADME,
				}}
			/>
		</ProductIntegrationLayout>
	)
}
