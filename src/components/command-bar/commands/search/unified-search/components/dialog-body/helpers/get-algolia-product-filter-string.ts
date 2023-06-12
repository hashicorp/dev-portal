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
		/**
		 * The edition:hcp only applies to `tutorials` records, which will
		 * never have products:hcp, but we can't apply complex filters
		 * via the Algolia filters API parameter, so we keep it simple here.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 *
		 * TODO: look into how tutorials library handles this? Does it use
		 * the filters parameter?
		 */
		filterString = `products:${productSlug} OR edition:${productSlug}`
	}

	return filterString
}
