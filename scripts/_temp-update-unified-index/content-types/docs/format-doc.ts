import { NormalizedSearchObject } from '../../types'
import { collectHeadings } from '../../utils/collect-headings'
import { collectCodeListItems } from '../../utils/collect-code-list-items'

type ApiDoc = $TSFixMe

/**
 * Format a docs API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. For example:
 */
export async function formatDoc(
	docsEntry: ApiDoc
): Promise<NormalizedSearchObject> {
	const normalizedProduct = docsEntry.product.split('-')[0]
	const pathWithNormalizedProduct = docsEntry._uniquePath.replace(
		docsEntry.product,
		normalizedProduct
	)
	/**
	 * TODO: more ESM CJS import issues.
	 *
	 * For now, manually installed non-ESM versions of `unist-util-visit`
	 * and `unist-util-is`, ran this script, then removed package.json changes.
	 */
	/**
	 * THOUGHT: maybe headings should be separate result items?
	 * And surface them, with permalink, if the doc itself isn't?
	 */
	const headings = await collectHeadings(docsEntry.markdownSource)
	/**
	 * THOUGHT: maybe codeListItems should be separate?
	 * And surface them, with permalink, if the doc itself isn't?
	 */
	const codeListItems = await collectCodeListItems(docsEntry.markdownSource)
	return {
		objectID: docsEntry.pk,
		description: docsEntry.metadata.description,
		page_title: docsEntry.metadata.page_title,
		products: [normalizedProduct],
		urlPath: normalizePathShim(`/` + pathWithNormalizedProduct),
		headings,
		codeListItems,
	}
}

function normalizePathShim(inputPath) {
	const replacementPairs = [
		['terraform/extend', 'terraform/plugin'],
		['terraform/cloud-docs-agents', 'terraform/cloud-docs/agents'],
		['terraform/plugin-framework', 'terraform/plugin/framework'],
		['terraform/plugin-log', 'terraform/plugin/log'],
		['terraform/plugin-mux', 'terraform/plugin/mux'],
		['terraform/plugin-sdkv2', 'terraform/plugin/sdkv2'],
		['terraform/plugin-testing', 'terraform/plugin/testing'],
	]
	let normalizedPath = inputPath
	for (const [find, replace] of replacementPairs) {
		normalizedPath = normalizedPath.replace(find, replace)
	}
	return normalizedPath
}
