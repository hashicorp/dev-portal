import { ProductSlug } from 'types/products'
import ProductRootDocsPathLanding from 'views/product-root-docs-path-landing'
import { generateGetStaticProps } from 'views/product-root-docs-path-landing/server'

const getStaticProps = generateGetStaticProps()

const getStaticPaths = async () => {
	return {
		paths: __config.dev_dot.beta_product_slugs.map(
			(productSlug: ProductSlug) => ({
				params: { productSlug },
			})
		),
		fallback: false,
	}
}

export { getStaticPaths, getStaticProps }
export default ProductRootDocsPathLanding
