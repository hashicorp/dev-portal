import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
// product data
import nomadData from 'data/nomad.json'
// page content, which we read in from filesystem
import fs from 'fs'
import path from 'path'

export async function getStaticPaths() {
	// Custom docs landing pages are generated for all <product>.rootDocsPaths
	const paths = nomadData.rootDocsPaths.map(({ path }) => {
		return { params: { rootDocsPath: path } }
	})
	return { paths, fallback: false }
}

export async function getStaticProps(context) {
	// Determine base path from params
	const basePath = context.params.rootDocsPath

	// Read in authored page content
	const contentFile = path.join(
		process.cwd(),
		`src/content/${nomadData.slug}/docs-landing/${basePath}.json`
	)

	/**
	 * TODO: would be nice to validate our docs landing content here.
	 * https://app.asana.com/0/1202097197789424/1202623957639540/f
	 */
	const pageContent = JSON.parse(fs.readFileSync(contentFile, 'utf8'))

	// Generate static props
	const generatedGetStaticProps = generateGetStaticProps({
		pageContent,
		includeMDXSource: true,
		product: nomadData as ProductData,
		basePath,
	})
	const staticProps = await generatedGetStaticProps(context)

	// Return static props
	return staticProps
}

export default ProductRootDocsPathLanding
