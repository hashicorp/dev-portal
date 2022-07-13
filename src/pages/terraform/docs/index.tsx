/**
 * TODO: should have "custom" docs landing page here.
 */

// import terraformData from 'data/terraform.json'
// import { ProductData } from 'types/products'
// import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
// import DocsView from 'views/docs-view'

// const basePath = 'docs'
// const baseName = 'Docs'
// const product = terraformData as ProductData
// const productSlugForLoader = 'terraform-website'

function DocsView(props) {
	return (
		<>
			<pre>
				<code>{JSON.stringify(props, null, 2)}</code>
			</pre>
			<pre>
				<code>{JSON.stringify({ propKeys: Object.keys(props) }, null, 2)}</code>
			</pre>
		</>
	)
}

// const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
// 	product,
// 	productSlugForLoader,
// 	basePath,
// 	baseName,
// })

// export { getStaticPaths, getStaticProps }

export async function getStaticProps() {
	return { props: { foo: 'shouldBeACustomDocsPageBar' } }
}
export default DocsView
