import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { cachedGetProductData } from 'lib/get-product-data'
import { fetchIntegration } from 'lib/integrations-api-client/integration'
import { fetchIntegrationRelease } from 'lib/integrations-api-client/release'
import { withTiming } from 'lib/with-timing'
import { ProductSlug } from 'types/products'
import ProductIntegration from 'views/product-integration'

interface PathParams {
	productSlug: ProductSlug
	integrationSlug: string[]
}
const _getServerSideProps = async ({ params }: { params: PathParams }) => {
	let version = null
	const { productSlug, integrationSlug: slugAndMaybeVersion } = params

	const integrationSlug = slugAndMaybeVersion[0]
	if (slugAndMaybeVersion.length === 2) {
		version = slugAndMaybeVersion[1]
	}
	if (slugAndMaybeVersion.length > 2) {
		console.log('Too many path segments for [integrationSlug]')
		return {
			notFound: true,
		}
	}

	const integrationResponse = await fetchIntegration(
		productSlug,
		integrationSlug
	)

	// 404
	if (integrationResponse.meta.status_code != 200) {
		return {
			notFound: true,
		}
	}
	const integration = integrationResponse.result

	// if no version in path, use latest integration release
	// otherwise fetch specific version
	const activeReleaseResponse = await fetchIntegrationRelease(
		productSlug,
		integrationSlug,
		version ?? integrationResponse.result.versions[0]
	)
	if (activeReleaseResponse.meta.status_code != 200) {
		console.warn('Could not fetch active release', activeReleaseResponse)
		return {
			notFound: true,
		}
	}
	const activeRelease = activeReleaseResponse.result

	const product = cachedGetProductData(params.productSlug)
	const breadcrumbLinks: BreadcrumbLink[] = [
		{
			title: 'Developer',
			url: '/',
			isCurrentPage: false,
		},
		{
			title: product.name,
			url: `/${product.slug}`,
			isCurrentPage: false,
		},
		{
			title: 'Integrations',
			url: `/${product.slug}/integrations`,
			isCurrentPage: false,
		},
		{
			title: integration.name,
			url: `/${product.slug}/integrations/${integration.slug}`,
			isCurrentPage: true,
		},
	]
	if (version !== null) {
		breadcrumbLinks[breadcrumbLinks.length - 1].isCurrentPage = false
		breadcrumbLinks.push({
			title: version,
			url: `/${product.slug}/integrations/${integration.slug}/${version}`,
			isCurrentPage: true,
		})
	}

	return {
		props: {
			integration,
			activeRelease: activeRelease,
			product: product,
			breadcrumbLinks: breadcrumbLinks,
		},
	}
}

const label = '[productSlug]/integrations/[integrationSlug]'
export const getServerSideProps = async (ctx) => {
	return withTiming(label, () => _getServerSideProps(ctx))
}
export default ProductIntegration
