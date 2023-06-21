import { ProductSlug } from 'types/products'
import { UnifiedSearchableContentType } from '../../../types'

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
 * TODO: for non-specific `resultType`, filter to only show `integration`
 * results for products with integrations config flags on.
 */
export function getAlgoliaFilters(
	productSlug?: ProductSlug,
	resultType?: UnifiedSearchableContentType
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
	if (resultType && resultType !== 'global') {
		typeFilter = `type:${resultType}`
	} else {
		/**
		 * TODO: add filter to only include 'integrations` for
		 * for products with integrations config flags on.
		 *
		 * Maybe something like...
		 *
		 * (type:docs OR type:tutorial OR products:<withIntegrations> OR products<withIntegrations>)
		 *
		 * ... which should show 'docs' and 'tutorial' entries for ALL products,
		 * and should show integrations for all explicitly specified products.
		 */
	}

	/**
	 * Combine filters, results must match ALL filters at once.
	 */
	return [typeFilter, productFilter]
		.filter((s) => s !== '')
		.map((s) => `(${s})`)
		.join(' AND ')
}
