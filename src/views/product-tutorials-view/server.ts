/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { LearnProductData, LearnProductName } from 'types/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import {
	getAllCollections,
	getCollectionsBySection,
} from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { sortAlphabetically } from 'lib/sort-alphabetically'
import {
	formatSidebarCategorySections,
	buildCategorizedHcpSidebar,
} from 'views/collection-view/helpers'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import { filterCollections } from './helpers'
import { SitemapCollection } from './components/sitemap/types'
import { formatSitemapCollection } from './components/sitemap/helpers'
import { ThemeOption } from 'lib/learn-client/types'
import { cachedGetProductData } from 'lib/get-product-data'
import getProcessedPageData from './helpers/page-data'
import { ProductPageData } from './helpers/page-data/types'
import { OutlineLinkItem } from 'components/outline-nav/types'
import outlineItemsFromHeadings from 'components/outline-nav/utils/outline-items-from-headings'

export interface ProductTutorialsViewProps {
	metadata: {
		title: string
	}
	data: ProductPageData
	layoutProps: ProductTutorialsLayout
	product: LearnProductData
	outlineItems: OutlineLinkItem[]
}

interface ProductTutorialsLayout {
	breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
	sidebarSections: CollectionCategorySidebarSection[]
}

/**
 * Note: this is a stub to get the /hcp/tutorials rendering.
 * TODO: figure out what to do with the /hcp/tutorials view (design dependent).
 * Taking this temporary approach for now while awaiting final designs.
 */
export async function getCloudTutorialsViewProps(): Promise<{
	props: ProductTutorialsViewProps
}> {
	const productData = cachedGetProductData('hcp')

	/**
	 * Fetch and process the authored page content
	 */
	const { pageData, headings } = await getProcessedPageData(ThemeOption.cloud)

	/**
	 * Build the sidebar
	 */
	const hcpCollections = await getCollectionsBySection('cloud')
	const sidebarSections = buildCategorizedHcpSidebar(hcpCollections)

	/**
	 * Build sitemap collections, if we're using them.
	 */
	let sitemapCollections: SitemapCollection[]
	if (pageData.showProductSitemap) {
		sitemapCollections = hcpCollections.map(formatSitemapCollection)
	}

	/**
	 * Return static props
	 */
	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				sitemapCollections,
			},
			outlineItems: outlineItemsFromHeadings(headings),
			layoutProps: {
				breadcrumbLinks: getTutorialsBreadcrumb({
					product: { name: productData.name, filename: productData.slug },
				}),
				sidebarSections,
			},
			// Note: should likely remove type casting here,
			// it's currently needed because "hcp" is not a valid LearnProductName.
			// Kind of a $TSFixMe.
			product: productData as LearnProductData,
		}),
	}
}

/**
 * Given a ProductData object (imported from src/data JSON files), fetches and
 * returns the page props for `/{product}/tutorials` pages.
 *
 * Merges the product object fetched from `/products/:identifier` with the given
 * ProductData object and returns the merged object under the `product` page
 * prop, which is needed for other areas of the app to function.
 */
export async function getProductTutorialsViewProps(
	productData: LearnProductData
): Promise<{ props: ProductTutorialsViewProps }> {
	const productSlug = productData.slug

	/**
	 * Fetch and process the authored page content
	 */
	const { pageData, headings } = await getProcessedPageData(productSlug)

	/**
	 * Get the product data, and all collections,
	 * both of which are needed for layoutProps
	 */
	const product = await getProduct(productSlug)
	const allProductCollections = await getAllCollections({
		product: { slug: productSlug, sidebarSort: true },
	})
	const filteredCollections = filterCollections(
		allProductCollections,
		productSlug
	)

	/**
	 * Build & return layout props to pass to SidebarSidecarLayout
	 */
	const layoutProps: ProductTutorialsLayout = {
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: product.name, filename: product.slug },
		}),
		sidebarSections: formatSidebarCategorySections(filteredCollections),
	}

	/**
	 * Build sitemap collections, if we're using them.
	 */
	let sitemapCollections: SitemapCollection[]
	if (pageData.showProductSitemap) {
		sitemapCollections = filteredCollections
			.sort(sortAlphabetically('name'))
			.map(formatSitemapCollection)
	}

	/**
	 * Destructuring the Learn data for now so it can be treated as the source of
	 * truth in this view.
	 *
	 * @TODO Determine which should be the source of truth in the long term since
	 * both Learn and existing Docs properties are both needed to be returned from
	 * here.
	 */
	const { description, docsUrl, id, name, slug } = product

	/**
	 * Return static props
	 */
	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				sitemapCollections,
			},
			layoutProps,
			outlineItems: outlineItemsFromHeadings(headings),
			product: {
				...productData,
				description,
				docsUrl,
				id,
				name: name as LearnProductName,
				slug,
			},
		}),
	}
}
