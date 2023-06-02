export function renderHighlightArray(facet, matchesOnly = false) {
	return (facet || [])
		.filter((entry) => {
			if (matchesOnly) {
				return entry.matchLevel !== 'none'
			} else {
				return true
			}
		})
		.map((entry) => {
			return entry?.value
		})
		.join(', ')
}
