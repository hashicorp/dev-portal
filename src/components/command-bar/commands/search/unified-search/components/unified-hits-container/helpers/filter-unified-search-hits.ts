// Types
import type { Hit } from 'instantsearch.js'
import type { CurrentContentType } from 'contexts'

type AlgoliaContentType = 'docs' | 'tutorial' | 'integration'

/**
 * Given a client-side search `CurrentContentType`,
 *
 * Return the corresponding `type` property used in Algolia, or `null` if the
 * incoming value has no corresponding `type` (such as for `global`).
 */
const algoliaContentTypeMap: Record<
	CurrentContentType,
	AlgoliaContentType | null
> = {
	integrations: 'integration',
	docs: 'docs',
	tutorials: 'tutorial',
	global: null,
}

/**
 * Given some hits from Algolia, and an optional content type to filter for,
 * Return only the hits that match the specified content type.
 *
 * If `contentType` is omitted, or if it is not a valid content type
 * used in Algolia search objects in our unified index, the hits
 * will be returned without filtering
 */
export function filterUnifiedSearchHits(
	hits: Hit[],
	contentType?: CurrentContentType
): Hit[] {
	// Get the normalized content type that we use in Algolia
	const algoliaContentType = algoliaContentTypeMap[contentType]

	// If there isn't a matching algolia content type (for "all", for example),
	// then don't filter the hits at all.
	if (algoliaContentType === null) {
		return hits
	}

	// Otherwise, filter out results that do not match the specified content type
	return hits.filter(
		(hit: Record<string, unknown>) => hit.type === algoliaContentType
	)
}
