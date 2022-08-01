import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import {
	generateProductLandingSidebarNavData,
	generateTopLevelSidebarNavData,
} from 'components/sidebar/helpers'
import TutorialsSidebar, {
	CollectionViewSidebarContent,
} from 'components/tutorials-sidebar'
import { ProductTutorialsSitemap } from 'views/product-tutorials-view/components'
import { ProductTutorialsViewProps } from 'views/product-tutorials-view/server'
import OptInOut from 'components/opt-in-out'
import { useOptInAnalyticsTracking } from 'hooks/use-opt-in-analytics-tracking'

import {
	getOverviewHeading,
	buildLayoutHeadings,
} from 'views/product-tutorials-view/helpers/heading-helpers'
import Link from 'next/link'
import BaseNewLayout from 'layouts/base-new'
import getProductPageContent from 'views/product-tutorials-view/helpers/get-product-page-content'
import Heading from 'components/heading'
import ProductViewContent from 'views/product-tutorials-view/components/product-view-content'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import processPageData from 'views/product-tutorials-view/helpers/process-page-data'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { SidebarMobileControlsProps } from 'components/sidebar/components/sidebar-mobile-controls'
import { SidebarProps } from 'components/sidebar'

export const WAF_SLUG = 'well-architected-framework'

// TODO - figure out betta API solution to serve sidebar data
// right now its fetching ALL collections and filtering based on the slug
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
				generateTopLevelSidebarNavData(
					'Well Architected Framework'
				) as SidebarProps,
				{
					title: 'Well Architected Framework',
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
			product: { name: 'Well Architected Framework', filename: WAF_SLUG },
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
