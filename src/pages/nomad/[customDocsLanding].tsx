import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
// product data
import nomadData from 'data/nomad.json'
// page content, which we read in from filesystem
import fs from 'fs'
import path from 'path'

export async function getStaticPaths() {
	// Custom docs landing pages are generated for all <product>.basePaths
	const paths = nomadData.basePaths.map((slug) => {
		return { params: { customDocsLanding: slug } }
	})
	return { paths, fallback: false }
}

export async function getStaticProps(context) {
	// Determine base path from params
	const basePath = context.params.customDocsLanding

	// Read in authored page content
	const contentFile = path.join(
		process.cwd(),
		`src/content/${nomadData.slug}/docs/${basePath}.json`
	)

	/**
	 * TODO: would be nice to validate our docs landing content here.
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
