import { NormalizedSearchObject } from '../../types'

type ApiDoc = $TSFixMe

/**
 * Format a docs API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. For example:
 * TODO: add `headings`, see `collectHeadings` in mktg-content-workflows
 * TODO: add `codeListItems`, see `collectCodeListItems` in mktg-content-workflows
 */
export function formatDoc(docsEntry: ApiDoc): NormalizedSearchObject {
	return {
		objectID: docsEntry.pk,
		description: docsEntry.metadata.description,
		page_title: docsEntry.metadata.page_title,
		products: [docsEntry.product],
		urlPath: `/${docsEntry._uniquePath}`,
	}
}
