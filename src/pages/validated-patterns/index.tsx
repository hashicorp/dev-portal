/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import slugify from 'slugify'
import { getCollectionsBySection } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { PageSlugOption } from 'lib/learn-client/api/page'
import ValidatedPatternsLandingView from 'views/validated-patterns'
import { buildCategorizedValidatedPatternsSidebar } from 'views/validated-patterns/utils/generate-sidebar-items'
import { ValidatedPatternsLandingProps } from 'views/validated-patterns/types'
import rawValidatedPatternsContent from 'content/validated-patterns/index.json'
import validatedPatternsData from 'data/validated-patterns.json'
import getProcessedPageData from 'views/product-tutorials-view/helpers/page-data'
import { TableOfContentsHeading } from 'components/table-of-contents'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'

export async function getStaticProps(): Promise<
	{ props: ValidatedPatternsLandingProps } | { notFound: boolean }
> {
	try {
		const { pageData, headings: pageHeadings } = await getProcessedPageData(
			validatedPatternsData.slug as PageSlugOption,
			{ showOverviewHeading: false }
		)
		const validatedPatternsCollections = await getCollectionsBySection(
			validatedPatternsData.slug
		)

		/**
		 * Build and add the slug for the overview heading
		 */
		const validatedPatternsContent = {
			...rawValidatedPatternsContent,
			landingPage: {
				...rawValidatedPatternsContent.landingPage,
				overview: {
					...rawValidatedPatternsContent.landingPage.overview,
					headingSlug: slugify(
						rawValidatedPatternsContent.landingPage.overview.heading,
						{
							lower: true,
						}
					),
				},
			},
		}

		const headings: TableOfContentsHeading[] = [
			{
				title: validatedPatternsContent.landingPage.overview.heading,
				level: 2,
				slug: validatedPatternsContent.landingPage.overview.headingSlug,
			},
			...pageHeadings,
		]
		const breadcrumbLinks = [
			{ title: 'Developer', url: '/' },
			{
				title: validatedPatternsData.name,
				url: `/${validatedPatternsData.slug}`,
				isCurrentPage: true,
			},
		]

		return {
			props: stripUndefinedProperties({
				metadata: {
					title: validatedPatternsData.name,
					name: validatedPatternsData.name,
					slug: validatedPatternsData.slug,
				},
				data: {
					pageData,
					validatedPatternsContent: validatedPatternsContent.landingPage,
				},
				outlineItems: outlineItemsFromHeadings(headings),
				layoutProps: {
					breadcrumbLinks,
					sidebarSections: buildCategorizedValidatedPatternsSidebar(
						validatedPatternsCollections,
						validatedPatternsContent.sidebarCategories
					),
				},
			}),
		}
	} catch {
		return { notFound: true }
	}
}

export default ValidatedPatternsLandingView
