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
 */
export function getAlgoliaProductFilterString(
	productSlug?: ProductSlug
): string {
	let filterString = ''

	if (productSlug) {
		filterString = `products:${productSlug}`

		/**
		 * The edition:hcp only applies to `tutorials` records, which will
		 * never have products:hcp, but we can't apply complex filters
		 * via the Algolia filters API parameter to only apply the `edition`
		 * filter to tutorial records, so we use an OR filter instead.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 */
		if (productSlug === 'hcp') {
			filterString += ` OR edition:${productSlug}`
		}
	}

	return filterString
}
