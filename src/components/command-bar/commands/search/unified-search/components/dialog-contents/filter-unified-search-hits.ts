export function filterUnifiedSearchHits(
	hits: $TSFixMe[],
	{ contentType }: { contentType?: $TSFixMe }
) {
	return hits.filter((hit) => {
		console.log({ hit })
		// Filter out results that do not match the specified content type
		if (contentType && hit.type !== contentType) {
			return false
		}
		// Return true otherwise
		return true
	})
}
