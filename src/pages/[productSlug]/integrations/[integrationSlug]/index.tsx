import { enabledProducts } from '../'
import { cachedGetProductData } from 'lib/get-product-data'
import {
	fetchProductIntegrations,
	fetchIntegration,
	fetchIntegrationRelease,
} from 'lib/integrations-api-client'
import ProductIntegration from 'views/product-integration'

export async function getStaticPaths() {
	let paths = []
	for (const product of enabledProducts) {
		const productIntegrations = await fetchProductIntegrations(product)
		const productPaths = productIntegrations.map((integration) => ({
			params: {
				productSlug: product,
				integrationSlug: integration.slug,
			},
		}))
		paths = paths.concat(productPaths)
	}
	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const integration = await fetchIntegration(
		params.productSlug,
		params.integrationSlug
	)
	// Just fetching the most recent release for now
	const latestRelease = await fetchIntegrationRelease(
		params.productSlug,
		params.integrationSlug,
		integration.versions[integration.versions.length - 1]
	)
	return {
		props: {
			integration,
			latestRelease,
			product: {
				...cachedGetProductData(params.productSlug),
			},
		},
	}
}

export default ProductIntegration
