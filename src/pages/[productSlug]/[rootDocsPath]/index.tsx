import { GetStaticPropsContext } from 'next'
import fs from 'fs'
import path from 'path'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import {
	generateRootDocsLandingPaths,
	generateRootDocsLandingProps,
} from 'views/product-root-docs-path-landing/server'

/**
 * Generates all of the /:productSlug/:rootDocsPath page paths.
 */
const getStaticPaths = async () => {
	return {
		paths: generateRootDocsLandingPaths(),
		fallback: false,
	}
}

/**
 * Generates the props for each /:productSlug/:rootDocsPath page.
 */
const getStaticProps = async (context: GetStaticPropsContext) => {
	/**
	 * Pull product slug and root docs path from context params
	 */
	const productSlug = context.params.productSlug as string
	const rootDocsPathSlug = context.params.rootDocsPath as string

	/**
	 * Fetch product data
	 */
	const productDataJsonFilePath = path.join(
		process.cwd(),
		`src/data/${productSlug}.json`
	)
	const product = JSON.parse(fs.readFileSync(productDataJsonFilePath, 'utf8'))

	/**
	 * Fetch and return the page props
	 */
	return generateRootDocsLandingProps({ context, product, rootDocsPathSlug })
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
