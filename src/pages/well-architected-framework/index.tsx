import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { generateTopLevelSidebarNavData } from 'components/sidebar/helpers'
import {
	getOverviewHeading,
	buildLayoutHeadings,
} from 'views/product-tutorials-view/helpers/heading-helpers'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import Heading from 'components/heading'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import processPageData from 'views/product-tutorials-view/helpers/process-page-data'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { SidebarProps } from 'components/sidebar'

export const WAF_SLUG = 'well-architected-framework'
export const WAF_NAME = 'Well Architected Framework'

export default function WellArchitectedFrameworkLanding(props) {
	const { data, layoutProps } = props
	const { pageData, inlineCollections, inlineTutorials } = data
	console.log({ props })

	const PageHeading = () => {
		const { title, level, slug } = getOverviewHeading()
		return (
			<Heading id={slug} level={level} size={500} weight="bold">
				{title}
			</Heading>
		)
	}

	return (
		<SidebarSidecarLayout
			headings={layoutProps.headings}
			sidebarNavDataLevels={[
				generateTopLevelSidebarNavData(WAF_NAME) as SidebarProps,
				{
					title: WAF_NAME,
					levelButtonProps: {
						levelUpButtonText: 'Main Menu',
						levelDownButtonText: 'Previous',
					},
					menuItems: layoutProps.sidebarSections.map((section) => ({
						title: section.name,
						fullPath: section.slug,
					})),
					showFilterInput: false,
				},
			]}
		>
			<PageHeading />
			<ProductViewContent
				blocks={pageData.blocks}
				inlineCollections={inlineCollections}
				inlineTutorials={inlineTutorials}
			/>
		</SidebarSidecarLayout>
	)
}

export async function getStaticProps() {
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(WAF_SLUG)
	const { pageData } = await processPageData(rawPageData)
	const wafCollections = await getCollectionsBySection(WAF_SLUG)
	const layoutProps = {
		headings: buildLayoutHeadings(pageData),
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: WAF_NAME, filename: WAF_SLUG },
		}),
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
