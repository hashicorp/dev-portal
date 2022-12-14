import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugs } from 'lib/products'

const normalizeRemoteLoaderSlug = (loaderSlug) => {
	return productSlugs.find((productSlug) => {
		if (loaderSlug === productSlug) {
			return true
		}

		const productData = cachedGetProductData(productSlug)
		return !!productData.rootDocsPaths.find((rootDocsPath) => {
			return loaderSlug === rootDocsPath.productSlugForLoader
		})
	})
}

export { normalizeRemoteLoaderSlug }
