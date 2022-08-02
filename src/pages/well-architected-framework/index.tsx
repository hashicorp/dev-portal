import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { PageSlugOption } from 'lib/learn-client/api/page'
import { buildLayoutHeadings as buildLayoutHeadingsFromBlocks } from 'views/product-tutorials-view/helpers/heading-helpers'
import WellArchitectedFrameworkLandingView, {
	wafData,
} from 'views/well-architected-framework'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import processPageData from 'views/product-tutorials-view/helpers/process-page-data'
import wafContent from 'content/well-architected-framework/index.json'

export async function getStaticProps() {
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(wafData.slug as PageSlugOption)
	const { pageData } = await processPageData(rawPageData)
	const wafCollections = await getCollectionsBySection(wafData.slug)
	const layoutProps = {
		headings: [
			{ title: wafContent.landingPage.overview.heading, level: 2 },
			...buildLayoutHeadingsFromBlocks({
				...pageData,
				showOverviewHeading: false,
			}),
		],
		breadcrumbLinks: [
			{ title: 'Developer', url: '/' },
			{ title: wafData.name, url: `/${wafData.slug}`, isCurrentPage: true },
		],
		sidebarSections: wafCollections,
	}

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				inlineCollections,
				inlineTutorials,
			},
			layoutProps,
		}),
	}
}

export default WellArchitectedFrameworkLandingView
