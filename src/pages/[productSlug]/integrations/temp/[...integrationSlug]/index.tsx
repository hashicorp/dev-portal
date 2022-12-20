import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import { withTiming } from 'lib/with-timing'
import { ProductSlug } from 'types/products'
import ProductIntegration from 'views/product-integration'

// Markdown -> MDX processing
import { serialize } from 'next-mdx-remote/serialize'
import { paragraphCustomAlerts, typography } from '@hashicorp/remark-plugins'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'

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
	integrationSlug: string[]
}

// /[productSlug]/integrations/[integrationSlug...and_maybe_version]
const _getServerSideProps = async ({ params }: { params: PathParams }) => {
	let version = null
	const { productSlug, integrationSlug: slugAndMaybeVersion } = params

	const integrationSlug = slugAndMaybeVersion[0]
	if (slugAndMaybeVersion.length === 2) {
		version = slugAndMaybeVersion[1]
	}

	// basic guard against bad paths
	if (slugAndMaybeVersion.length > 2) {
		console.error('Too many path segments for [integrationSlug]')
		return { notFound: true }
	}

	const integrationResponse = await fetchIntegration(
		productSlug,
		integrationSlug
	)

	// Integration could not be found
	if (integrationResponse.meta.status_code != 200) {
		console.warn('Could not fetch integration', integrationResponse)
		return { notFound: true }
	}
	const integration = integrationResponse.result

	// if no version in path, use latest integration release
	// otherwise fetch specific version
	const activeReleaseResponse = await fetchIntegrationRelease(
		productSlug,
		integrationSlug,
		version ?? integrationResponse.result.versions[0]
	)

	// Integration release could not be found
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn(
			'Could not fetch release for version',
			version,
			activeReleaseResponse
		)
		return { notFound: true }
	}

	const activeRelease = activeReleaseResponse.result

	const product = cachedGetProductData(params.productSlug)
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
		},
	]
	if (version !== null) {
		breadcrumbLinks.push({
			title: version,
			url: `/${product.slug}/integrations/${integration.slug}/${version}`,
		})
	}
	// mark last breadcrumb as current page
	breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = true

	// Generate versions list for Version selector dropdown.
	// We do this server side to keep the client decoupled from path structure
	const versions = integration.versions.map((version, i) => {
		if (i === 0) {
			return {
				value: version,
				label: `v${version} (latest)`,
				href: `/${product.slug}/integrations/${integration.slug}`,
			}
		}
		return {
			value: version,
			label: `v${version}`,
			href: `/${product.slug}/integrations/${integration.slug}/${version}`,
		}
	})

	// inject readmeMdxSource into integration and component objects
	activeRelease.components = await Promise.all(
		activeRelease.components.map(async (component) => {
			return {
				...component,
				readmeMdxSource: await serialize(component.readme, SERIALIZE_OPTIONS),
			}
		})
	)

	// @ts-expect-error - this is a custom property we're adding to the integration object
	integration.readmeMdxSource = await serialize(
		activeRelease.readme,
		SERIALIZE_OPTIONS
	)
	return {
		props: {
			integration,
			activeRelease: activeRelease,
			product: product,
			breadcrumbLinks: breadcrumbLinks,
			versions: versions,
		},
	}
}

const label = '[productSlug]/integrations/[integrationSlug]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegration
