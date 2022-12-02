import { ProductSlug } from 'types/products'
import { getStaticProps as _getStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { withTiming } from 'lib/with-timing'
import { activeProductSlugs } from 'lib/products'

/**
 * Generates the paths for all /:productSlug/docs routes.
 */
const getStaticPaths = async () => {
	const paths = activeProductSlugs.map((productSlug: ProductSlug) => ({
		params: { productSlug },
	}))

	return {
		paths,
		fallback: false,
	}
}

const getStaticProps = (ctx) => {
	return withTiming(
		`[[productSlug]/docs/index::getStaticProps] (${ctx.params.productSlug})`,
		() => _getStaticProps(ctx)
	)
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
