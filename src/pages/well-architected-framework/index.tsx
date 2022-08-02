import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { PageSlugOption } from 'lib/learn-client/api/page'
import { buildLayoutHeadings as buildLayoutHeadingsFromBlocks } from 'views/product-tutorials-view/helpers/heading-helpers'
import WellArchitectedFrameworkLandingView, {
	wafData,
} from 'views/well-architected-framework'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import processPageData from 'views/product-tutorials-view/helpers/process-page-data'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import wafContent from 'content/well-architected-framework/index.json'
import { WellArchitectedFrameworkLandingProps } from 'views/well-architected-framework/types'

export async function getStaticProps(): Promise<{
	props: WellArchitectedFrameworkLandingProps
}> {
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(wafData.slug as PageSlugOption)
	const { pageData } = await processPageData(rawPageData)
	const wafCollections = await getCollectionsBySection(wafData.slug)
	const headings = [
		{ title: wafContent.landingPage.overview.heading, level: 2 },
		...buildLayoutHeadingsFromBlocks({
			...pageData,
			showOverviewHeading: false,
		}),
	]
	const breadcrumbLinks = [
		{ title: 'Developer', url: '/' },
		{ title: wafData.name, url: `/${wafData.slug}`, isCurrentPage: true },
	]

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: wafData.name,
				name: wafData.name,
				slug: wafData.slug,
			},
			data: {
				pageData: { ...wafContent.landingPage, ...pageData },
				inlineCollections,
				inlineTutorials,
			},
			layoutProps: {
				headings,
				breadcrumbLinks,
				sidebarSections: buildCategorizedWafSidebar(
					wafCollections,
					wafContent.sidebarCategories
				),
			},
		}),
	}
}

export default WellArchitectedFrameworkLandingView
