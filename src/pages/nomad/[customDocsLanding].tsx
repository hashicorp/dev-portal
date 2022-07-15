import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
// product data
import nomadData from 'data/nomad.json'
// page content
import fs from 'fs'
import path from 'path'
// import pageContent from './content.json'

const CUSTOM_DOCS_LANDING_PATHS = ['api-docs', 'docs', 'plugins', 'tools']

// function ProductRootDocsPathLanding(props) {
// 	return (
// 		<>
// 			<pre>
// 				<code>{JSON.stringify(props, null, 2)}</code>
// 			</pre>
// 		</>
// 	)
// }

export async function getStaticPaths() {
	const paths = CUSTOM_DOCS_LANDING_PATHS.map((slug) => {
		return { params: { customDocsLanding: slug } }
	})
	return { paths, fallback: false }
}

export async function getStaticProps(context) {
	// Determine base path from params
	const basePath = context.params.customDocsLanding

	// Read in authored page content
	// TODO: could read content file from within generateGetStaticProps
	const contentFile = path.join(
		process.cwd(),
		`src/content/${nomadData.slug}/docs-custom-landing/${basePath}.json`
	)
	// TODO: should likely validate content here
	const pageContent = JSON.parse(fs.readFileSync(contentFile, 'utf8'))

	// Generate static props
	const generatedGetStaticProps = generateGetStaticProps({
		pageContent,
		includeMDXSource: true,
		product: nomadData as ProductData,
		basePath,
	})
	const staticProps = await generatedGetStaticProps(context)

	//
	return staticProps
}

export default ProductRootDocsPathLanding
