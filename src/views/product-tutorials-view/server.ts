import { LearnProductData } from 'types/products'
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
import getProductPageContent from './helpers/get-product-page-content'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import {
	InlineCollections,
	InlineTutorials,
} from './helpers/get-inline-content'
import { filterCollections } from './helpers'
import processPageData from './helpers/process-page-data'
import { buildLayoutHeadings } from './helpers/heading-helpers'
import { ProductViewBlock } from './components/product-view-content'
import { ProductTutorialsSitemapProps } from './components/sitemap/types'
import { formatSitemapCollection } from './components/sitemap/helpers'
import { ThemeOption } from 'lib/learn-client/types'
import { cachedGetProductData } from 'lib/get-product-data'

export interface ProductTutorialsViewProps {
	data: ProductPageData
	layoutProps: ProductTutorialsLayout
	product: LearnProductData
}

interface ProductTutorialsLayout {
	breadcrumbLinks: SidebarSidecarLayoutProps['breadcrumbLinks']
	headings: SidebarSidecarLayoutProps['headings']
	sidebarSections: CollectionCategorySidebarSection[]
}

export interface ProductPageData {
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	}
	allCollections: ProductTutorialsSitemapProps['collections']
	inlineCollections: InlineCollections
	inlineTutorials: InlineTutorials
}

/**
 * Note: this is a stub to get the /hcp/tutorials rendering.
 * TODO: figure out what to do with the /hcp/tutorials view (design dependent).
 * Taking this temporary approach for now while awaiting final designs.
 */
export async function getCloudTutorialsViewProps() {
	const productData = cachedGetProductData('hcp')

	/**
	 * Build the sidebar
	 */
	const hcpCollections = await getCollectionsBySection('cloud')
	const sidebarSections = buildCategorizedHcpSidebar(hcpCollections)

	/**
	 * Get the raw page data
	 */
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(ThemeOption.cloud)

	/**
	 * Process page data, reformatting as needed.
	 * Includes parsing headings, for use with the page's sidecar
	 */
	const { pageData, headings } = await processPageData(rawPageData)

	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				inlineCollections,
				inlineTutorials,
				allCollections: hcpCollections,
			},
			layoutProps: {
				headings,
				breadcrumbLinks: getTutorialsBreadcrumb({
					product: { name: productData.name, filename: productData.slug },
				}),
				sidebarSections,
			},
			product: productData,
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
	 * Get the raw page data
	 */
	const {
		pageData: rawPageData,
		inlineCollections,
		inlineTutorials,
	} = await getProductPageContent(productSlug)
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
	 * Process page data, reformatting as needed.
	 * Includes parsing headings, for use with the page's sidecar
	 */
	const { pageData } = await processPageData(rawPageData)
	/**
	 * Build & return layout props to pass to SidebarSidecarLayout
	 */
	const layoutProps: ProductTutorialsLayout = {
		headings: buildLayoutHeadings(pageData),
		breadcrumbLinks: getTutorialsBreadcrumb({
			product: { name: product.name, filename: product.slug },
		}),
		sidebarSections: formatSidebarCategorySections(filteredCollections),
	}

	const sitemapCollections: ProductTutorialsSitemapProps['collections'] =
		filteredCollections
			.sort(sortAlphabetically('name'))
			.map(formatSitemapCollection)

	/**
	 * Destructuring the Learn data for now so it can be treated as the source of
	 * truth in this view.
	 *
	 * @TODO Determine which should be the source of truth in the long term since
	 * both Learn and existing Docs properties are both needed to be returned from
	 * here.
	 */
	const { description, docsUrl, id, name, slug } = product
	return {
		props: stripUndefinedProperties({
			metadata: {
				title: 'Tutorials',
			},
			data: {
				pageData,
				allCollections: sitemapCollections,
				inlineCollections,
				inlineTutorials,
			},
			layoutProps,
			product: {
				...productData,
				description,
				docsUrl,
				id,
				name,
				slug,
			},
		}),
	}
}
