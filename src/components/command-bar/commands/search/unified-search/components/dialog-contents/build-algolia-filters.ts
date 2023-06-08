export function buildAlgoliaFilters(currentProductTag: $TSFixMe): string {
	let productFilter = ''

	if (currentProductTag) {
		const { id } = currentProductTag
		/**
		 * The edition:hcp only applies to `tutorials` records, which will
		 * never have products:hcp, but we can't apply complex filters
		 * via the Algolia filters API parameter, so we keep it simple here.
		 * Ref: https://www.algolia.com/doc/api-reference/api-parameters/filters/
		 *
		 * TODO: look into how tutorials library handles this? Does it use
		 * the filters parameter?
		 */
		productFilter = `products:${id} OR edition:${id}`
	}

	console.log({ productFilter })

	return productFilter
}
