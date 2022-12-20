import { BreadcrumbLink } from 'components/breadcrumb-bar'
import ProductIntegrationLayout from 'layouts/product-integration-layout'
import defaultMdxComponents from 'layouts/sidebar-sidecar/utils/_local_platform-docs-mdx'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ProductData } from 'types/products'

interface ProductIntegrationReadmeViewProps {
	product: ProductData
	integration: Integration & { readmeMdxSource: MDXRemoteSerializeResult }
	activeRelease: Release
	breadcrumbLinks: BreadcrumbLink[]
}

export default function ProductIntegrationReadmeView({
	product,
	integration,
	activeRelease,
	breadcrumbLinks,
}: ProductIntegrationReadmeViewProps) {
	return (
		<ProductIntegrationLayout
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				return `/${product.slug}/integrations/${integration.slug}/${version}`
			}}
		>
			<MDXRemote
				{...integration.readmeMdxSource}
				components={defaultMdxComponents({})}
			/>
		</ProductIntegrationLayout>
	)
}
