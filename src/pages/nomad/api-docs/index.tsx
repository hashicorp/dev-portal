import { ProductData } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'
// product data
import nomadData from 'data/nomad.json'
// page content
import pageContent from './content.json'

/**
 * TODO: would it make sense to also have like a
 * [...allDocsCustomLanding].tsx page file?
 * Could further reduce boilerplate files in src/pages.
 * Already loading content from JSON, might be nice to
 * load AND VALIDATE via getStaticProps.
 */
const getStaticProps = generateGetStaticProps({
	pageContent,
	product: nomadData as ProductData,
	basePath: 'api-docs',
})

export { getStaticProps }
export default ProductRootDocsPathLanding
