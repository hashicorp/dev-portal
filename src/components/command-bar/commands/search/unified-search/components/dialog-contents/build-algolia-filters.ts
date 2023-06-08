export function buildAlgoliaFilters(
	currentProductTag: $TSFixMe,
	currentContentType: $TSFixMe
) {
	const filters = []
	if (currentProductTag) {
		const { id } = currentProductTag
		if (id === 'hcp' && currentContentType === 'tutorials') {
			// For tutorials, handle HCP product, which is really an "edition"
			/**
			 * TODO: when currentContentType === 'all', this doesn't work as expected!
			 * Docs will be filtered by "products:hcp", which is fine,
			 * but tutorials will also be filtered by "products:hcp", which ain't right.
			 * Maybe in such cases we need to build a more complex filter? Like
			 * `edition:hcp` OR `products:hcp`? Maybe such an OR filter would
			 * work fine for any tab anyways?
			 */
			filters.push('edition:hcp')
		} else {
			filters.push(`products:${id}`)
		}
	}

	// Filter by content type
	if (currentContentType) {
		// TODO: this could be simpler if we modified the `SearchableContentType`.
		const algoliaContentType = {
			docs: 'docs',
			tutorials: 'tutorial',
			integrations: 'integration',
		}[currentContentType]
		if (algoliaContentType) {
			filters.push(`type:${algoliaContentType}`)
		}
	}

	return filters
}
