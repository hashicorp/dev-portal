/**
 * Placeholder function to render some highlighted information.
 *
 * We'll replace this with something properly usable in a future pass
 * to the "All" tab work for unified search.
 */
export function renderHighlightArrayHtml(facet, matchesOnly = false): string[] {
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
}
