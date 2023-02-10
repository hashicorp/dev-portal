import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { PageSlugOption } from 'lib/learn-client/api/page'
import WellArchitectedFrameworkLandingView from 'views/well-architected-framework'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import { WellArchitectedFrameworkLandingProps } from 'views/well-architected-framework/types'
import rawWafContent from 'content/well-architected-framework/index.json'
import wafData from 'data/well-architected-framework.json'
import getProcessedPageData from 'views/product-tutorials-view/helpers/page-data'

export async function getStaticProps(): Promise<{
	props: WellArchitectedFrameworkLandingProps
}> {
	const { pageData } = await getProcessedPageData(
		wafData.slug as PageSlugOption,
		{ showOverviewHeading: false }
	)
	const wafCollections = await getCollectionsBySection(wafData.slug)

	/**
	 * Build and add the slug for the overview heading
	 */
	const wafContent = {
		...rawWafContent,
		landingPage: {
			...rawWafContent.landingPage,
			overview: rawWafContent.landingPage.overview,
		},
	}

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
				pageData,
				wafContent: wafContent.landingPage,
			},
			layoutProps: {
				headings: [],
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
