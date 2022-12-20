import ProductIntegrationLayout from 'layouts/product-integration-layout'
import { Integration } from 'lib/integrations-api-client/integration'
import { Release } from 'lib/integrations-api-client/release'
import { ProductData } from 'types/products'

interface ProductIntegrationNestedProps {
	product: ProductData
	integration: Integration
	activeRelease: Release
}

export default function ProductIntegrationNested({
	product,
	integration,
	activeRelease,
}: ProductIntegrationNestedProps) {
	return (
		<ProductIntegrationLayout
			currentProduct={product}
			integration={integration}
			activeRelease={activeRelease}
		>
			<h1>Hello Worldd</h1>
		</ProductIntegrationLayout>
	)
}
