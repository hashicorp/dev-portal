import { ProductSlug } from 'types/products'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'

/**
 * Generates the paths for all /:productSlug/docs routes.
 */
const getStaticPaths = async () => {
	const paths = __config.dev_dot.beta_product_slugs.map(
		(productSlug: ProductSlug) => ({
			params: { productSlug },
		})
	)

	return {
		paths,
		fallback: false,
	}
}

/**
 * Generates the page props for all /:productSlug/docs routes.
 */
const getStaticProps = generateGetStaticProps()

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
