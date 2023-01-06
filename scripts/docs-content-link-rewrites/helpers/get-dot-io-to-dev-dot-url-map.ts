import { cachedGetProductData } from 'lib/get-product-data'
import { productSlugsToHostNames } from 'lib/products'
import { ProductSlug } from 'types/products'

/**
 * Creates a map of .io urls to dev dot paths based on the
 * `PRODUCT_SLUGS_TO_HOST_NAMES` and `PRODUCT_SLUGS_TO_BASE_PATHS` constants.
 *
 * Not all .io links can be rewritten to dev dot paths, such as the /community
 * pages, so those are not included in the generated map.
 *
 * Adapted from:
 * https://github.com/hashicorp/learn-redirect-service/blob/main/lib/_tmp/get-docs-to-dev-dot-url-map.js
 */
const getDocsToDevDotUrlMap = () => {
	try {
		const paths = {}

		Object.keys(productSlugsToHostNames).forEach((productSlug: ProductSlug) => {
			if (productSlug === 'sentinel') {
				return
			}

			const hostName = productSlugsToHostNames[productSlug]
			const productData = cachedGetProductData(productSlug)

			const basePaths = productData.basePaths
			basePaths.forEach((basePath: string) => {
				;[
					`https://${hostName}/${basePath}`,
					`https://${hostName}/${basePath}/`,
					`https://www.${hostName}/${basePath}`,
					`https://www.${hostName}/${basePath}/`,
				].forEach((oldPath: string) => {
					paths[oldPath] = `/${productSlug}/${basePath}`
				})
			})
			;[
				`https://${hostName}`,
				`https://${hostName}/`,
				`https://www.${hostName}`,
				`https://www.${hostName}/`,
			].forEach((oldPath: string) => {
				paths[oldPath] = `/${productSlug}`
			})
		})

		return {
			...paths,
			'https://www.vagrantup.com/vmware/downloads': '/vagrant/downloads/vmware',
			'https://www.vagrantup.com/vmware/downloads/':
				'/vagrant/downloads/vmware',
			'https://vagrantup.com/vmware/downloads': '/vagrant/downloads/vmware',
			'https://vagrantup.com/vmware/downloads/': '/vagrant/downloads/vmware',
		}
	} catch (e) {
		console.error('Could not generate collection paths ', e.message)
		throw e
	}
}

export { getDocsToDevDotUrlMap }
