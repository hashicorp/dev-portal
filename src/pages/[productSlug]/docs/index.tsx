import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'

/**
 * TODO: cloud.hashicorp.com/docs redirects to cloud.hashicorp.com/docs/hcp,
 * and the content for the former URL is empty (just a heading).
 * This is a workaround to prevent the empty content from being rendered.
 * https://github.com/hashicorp/cloud.hashicorp.com/blob/main/content/docs/index.mdx
 *
 * Related redirects-in-dev-dot issues:
 * - Load redirects from private repos:
 *   https://app.asana.com/0/1202097197789424/1202532915796679/f
 * - Get remotely sourced redirects working for dev-dot routes:
 *   https://app.asana.com/0/1201987349274776/1201662082096106/f
 */

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
const getStaticProps = async (context) => {
	// Fetch product data
	const productSlug = context.params.productSlug
	const product = cachedGetProductData(productSlug)

	// Generate static props
	const generatedGetStaticProps = generateGetStaticProps({
		basePath: 'docs',
		product,
	})
	const generatedStaticProps = await generatedGetStaticProps(context)

	// Return props
	return generatedStaticProps
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
