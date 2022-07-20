import fs from 'fs'
import path from 'path'
import { ProductSlug } from 'types/products'
import { cachedGetProductData } from 'lib/get-product-data'
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
const getStaticProps = async (context) => {
	// Fetch product data
	const productSlug = context.params.productSlug
	const product = cachedGetProductData(productSlug)

	// Fetch page content
	const jsonFilePath = path.join(
		process.cwd(),
		`src/content/${productSlug}/docs-landing.json`
	)
	const pageContent = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

	// Generate static props
	const generatedGetStaticProps = generateGetStaticProps({
		basePath: 'docs',
		pageContent,
		product,
	})
	const generatedStaticProps = await generatedGetStaticProps(context)

	// Return props
	return generatedStaticProps
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
