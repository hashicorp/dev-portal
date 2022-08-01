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
import { PageSlugOption } from 'lib/learn-client/api/page'
import { sortAlphabetically } from 'views/product-tutorials-view/helpers'

export const wafData = {
	slug: 'well-architected-framework',
	name: 'Well Architected Framework',
	/**
	 * TODO: figure out where this data should live. It could be here for now as a workaround
	 * Problem: we don't have a way to generate these sidebar categories currently
	 * via the tutorials repo data. We could add these to the generic waf page data, or create a new
	 * data file in dev dot to store this data for now.
	 */
	sidebarCategories: [
		{
			name: 'Framework Pillars',
			collections: [
				'well-architected-framework/operational-excellence',
				'well-architected-framework/reliability',
			],
		},
		{
			name: 'Reference Architecture',
			collections: [
				'well-architected-framework/nomad',
				'well-architected-framework/terraform',
				'well-architected-framework/zero-trust-networking',
				'well-architected-framework/zer-trust-security',
			],
		},
	],
}

// @TODO - add the heading 'callout' and the description section with picture...
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
				generateTopLevelSidebarNavData(wafData.name) as SidebarProps,
				{
					title: wafData.name,
					levelButtonProps: {
						levelUpButtonText: 'Main Menu',
						levelDownButtonText: 'Previous',
					},
					menuItems: [
						/**@TODO currently these sort alphabetically. We should
						 * add sidebar categorization for non-product specific collections
						 * */
						{ title: 'Overview', isActive: true, fullPath: `${wafData.slug}` },
						...layoutProps.sidebarSections
							.sort(sortAlphabetically('name'))
							.map((section) => ({
								title: section.name,
								fullPath: section.slug,
							})),
					],
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
	} = await getProductPageContent(wafData.slug as PageSlugOption)
	const { pageData } = await processPageData(rawPageData)
	const wafCollections = await getCollectionsBySection(wafData.slug)
	const layoutProps = {
		headings: buildLayoutHeadings(pageData),
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: wafData.name, filename: wafData.slug },
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
