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
			breadcrumbLinks={breadcrumbLinks}
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
			getVersionChangedURL={(version: string) => {
				if (version === integration.versions[0]) {
					return `/${product.slug}/integrations/${integration.slug}`
				} else {
					return `/${product.slug}/integrations/${integration.slug}/${version}`
				}
			}}
		>
			<MDXRemote {...serializedREADME} components={defaultMdxComponents({})} />
		</ProductIntegrationLayout>
	)
}
