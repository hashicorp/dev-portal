import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import { serialize } from 'next-mdx-remote/serialize'
import { ProductSlug } from 'types/products'
import ProductIntegrationReadmeView from 'views/product-integration/readme-view'

import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import rehypePrism from '@mapbox/rehype-prism'

// TODO: export types from `next-mdx-remote` v3
const SERIALIZE_OPTIONS: Parameters<typeof serialize>[1] = {
	mdxOptions: {
		remarkPlugins: [paragraphCustomAlerts, typography],
		rehypePlugins: [
			[rehypePrism, { ignoreMissing: true }],
			rehypeSurfaceCodeNewlines,
		],
	},
}

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string
}

export async function getServerSideProps({
	params: { productSlug, integrationSlug },
}: {
	params: PathParams
}) {
	// 404 if we're not on an enabled page
	if (!ENABLED_INTEGRATION_PRODUCTS.includes(productSlug)) {
		return {
			notFound: true,
		}
	}

	//
	const product = cachedGetProductData(productSlug)

	// ===== Fetch Integration
	const integrationResponse = await fetchIntegration(
		product.slug,
		integrationSlug
	)
	if (integrationResponse.meta.status_code != 200) {
		console.warn('Could not fetch integration', integrationResponse)
		return { notFound: true }
	}
	const integration = integrationResponse.result

	// ==== Fetch Active Release
	const activeReleaseResponse = await fetchIntegrationRelease(
		product.slug,
		integrationSlug,
		integrationResponse.result.versions[0] // TODO
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn(
			'Could not fetch release for latest version',
			activeReleaseResponse
		)
		return { notFound: true }
	}
	const activeRelease = activeReleaseResponse.result

	// Calculate breadcrumbs
	const breadcrumbLinks: BreadcrumbLink[] = [
		{
			title: 'Developer',
			url: '/',
		},
		{
			title: product.name,
			url: `/${product.slug}`,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
		},
		{
			title: integration.name,
			url: `/${product.slug}/integrations/${integration.slug}`,
			isCurrentPage: true,
		},
	]

	// @ts-expect-error - this is a custom property we're adding to the integration object
	integration.readmeMdxSource = await serialize(
		activeRelease.readme,
		SERIALIZE_OPTIONS
	)

	return {
		props: {
			product: {
				...cachedGetProductData(productSlug),
			},
			integration,
			activeRelease,
			breadcrumbLinks,
		},
	}
}

export default ProductIntegrationReadmeView
