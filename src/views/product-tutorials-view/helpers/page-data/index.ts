import { PageSlugOption } from 'lib/learn-client/api/page'
import getProductPageContent from './get-product-page-content'
import { processPageData } from './process-page-data'

async function getProcessedPageData(
	pageSlug: PageSlugOption,
	options?: { showOverviewHeading?: boolean }
) {
	/**
	 * Get the raw page data
	 */
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(pageSlug)
	/**
	 * Process the page data.
	 * Includes parsing headings, for use with the page's sidecar
	 */
	const { pageData, headings } = await processPageData(
		rawPageData,
		inlineCollections,
		inlineTutorials,
		options?.showOverviewHeading
	)
	return { pageData, headings }
}
export default getProcessedPageData
