import { ProductSlug } from 'types/products'

/**
 * Given an optional product slug,
 *
 * Return an Algolia `filter` string that will filter for search objects
 * of any type (`docs`, `tutorial`, or `integration`) that match the
 * specified product slug.
 *
 * Note: intended for use with our unified search indices, which are
 * named `<env>_DEVDOT_omni` in Algolia.
 *
 * TODO: add functionality to exclude integrations for certain products somehow?
 * Maybe this is as simple as a client-side filter once the other filter
 * fixes have been put in place.
 */
export function getAlgoliaProductFilterString(
	productSlug?: ProductSlug,
	resultType?: 'all' | 'docs' | 'integration' | 'tutorial'
): string {
	/**
	 * Product filter
	 */
	let productFilter = ''
	if (productSlug) {
		productFilter = `products:${productSlug}`

		/**
		 * The edition:hcp only applies to `tutorials` records, which will
		 * never have products:hcp, but we can't apply complex filters
		 * via the Algolia filters API parameter to only apply the `edition`
		 * filter to tutorial records, so we use an OR filter instead.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 */
		if (productSlug === 'hcp') {
			productFilter += ` OR edition:${productSlug}`
		}
	}

	/**
	 * Type filter
	 */
	let typeFilter = ''
	if (resultType && resultType !== 'all') {
		typeFilter = `type:${resultType}`
	}

	/**
	 * Combine filters, results must match ALL filters at once.
	 */
	return [typeFilter, productFilter]
		.filter((s) => s !== '')
		.map((s) => `(${s})`)
		.join(' AND ')
}
