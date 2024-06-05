/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { PageSlugOption } from 'lib/learn-client/api/page'
import WellArchitectedFrameworkLandingView from 'views/well-architected-framework'
import { buildCategorizedWafSidebar } from 'views/well-architected-framework/utils/generate-sidebar-items'
import { WellArchitectedFrameworkLandingProps } from 'views/well-architected-framework/types'
import rawWafContent from 'content/well-architected-framework/index.json'
import wafData from 'data/well-architected-framework.json'
import getProcessedPageData from 'views/product-tutorials-view/helpers/page-data'
import { TableOfContentsHeading } from 'components/table-of-contents'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'

export async function getStaticProps(): Promise<{
	props: WellArchitectedFrameworkLandingProps
}> {
	const { pageData, headings: pageHeadings } = await getProcessedPageData(
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
			overview: {
				...rawWafContent.landingPage.overview,
				headingSlug: slugify(rawWafContent.landingPage.overview.heading, {
					lower: true,
				}),
			},
		},
	}

	const headings: TableOfContentsHeading[] = [
		{
			title: wafContent.landingPage.overview.heading,
			level: 2,
			slug: wafContent.landingPage.overview.headingSlug,
		},
		...pageHeadings,
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
				pageData,
				wafContent: wafContent.landingPage,
			},
			outlineItems: outlineItemsFromHeadings(headings),
			layoutProps: {
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
