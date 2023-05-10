import { NormalizedSearchObject } from '../../types'
// import { collectHeadings } from '../../utils/collect-headings'
// import { collectCodeListItems } from '../../utils/collect-code-list-items'

type ApiDoc = $TSFixMe

/**
 * Format a docs API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. For example:
 * TODO: add `headings`, see `collectHeadings` in mktg-content-workflows
 * TODO: add `codeListItems`, see `collectCodeListItems` in mktg-content-workflows
 */
export async function formatDoc(
	docsEntry: ApiDoc
): Promise<NormalizedSearchObject> {
	/**
	 * TODO: yay! more ESM CJS import issues.
	 * Need to figure out how to fix up config... maybe need to eject
	 * from hc-tools for running this?
	 */
	// const headings = await collectHeadings(docsEntry.markdownSource)
	// const codeListItems = await collectCodeListItems(docsEntry.markdownSource)
	return {
		objectID: docsEntry.pk,
		description: docsEntry.metadata.description,
		page_title: docsEntry.metadata.page_title,
		products: [docsEntry.product],
		urlPath: `/${docsEntry._uniquePath}`,
		// headings,
		// codeListItems,
	}
}
