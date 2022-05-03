import { LearnProductData, ProductData } from 'types/products'
import { SidebarSidecarLayoutProps } from 'layouts/sidebar-sidecar'
import {
  Product as ClientProduct,
  Collection as ClientCollection,
} from 'lib/learn-client/types'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { formatSidebarCategorySections } from 'views/collection-view/helpers'
import getProductPageContent from './helpers/get-product-page-content'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { CollectionCategorySidebarSection } from 'views/collection-view/helpers'
import {
  InlineCollections,
  InlineTutorials,
} from './helpers/get-inline-content'
import {
  addHeadingSlugsToBlocks,
  buildLayoutHeadings,
} from './helpers/heading-helpers'
import { filterCollections, sortAlphabetically } from './helpers'
import { ProductViewBlock } from './components/product-view-content'

// Some of the product data is coming from the API client on this view
type ProductTutorialsPageProduct = ClientProduct &
  Omit<ProductData, 'name' | 'slug'>

export interface ProductTutorialsViewProps {
  layoutProps: ProductTutorialsLayout
  data: ProductPageData
  product: ProductTutorialsPageProduct
}

type ProductTutorialsLayout = Pick<
  SidebarSidecarLayoutProps,
  'headings' | 'breadcrumbLinks'
> & { sidebarSections: CollectionCategorySidebarSection[] }

export interface ProductPageData {
  pageData: {
    blocks: ProductViewBlock[]
    showProductSitemap?: boolean
  }
  allCollections: ClientCollection[]
  inlineCollections: InlineCollections
  inlineTutorials: InlineTutorials
}

/**
 * Given a ProductData object (imported from src/data JSON files), fetches and
 * returns the page props for `/{product}/tutorials` pages.
 *
 * Merges the product object fetched from `/products/:identifier` with the given
 * ProductData object and returns the merged object under the `product` page
 * prop, which is needed for other areas of the app to function.
 *
 * @TODO add sidebar sort capability
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
   * Add headings to raw page data, for use with the page's sidecar
   */
  const pageData = addHeadingSlugsToBlocks(rawPageData)
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
  const layoutProps = {
    headings: buildLayoutHeadings(pageData),
    breadcrumbLinks: getTutorialsBreadcrumb({
      product: { name: product.name, filename: product.slug },
    }),
    sidebarSections: formatSidebarCategorySections(filteredCollections),
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
  return {
    props: stripUndefinedProperties({
      data: {
        pageData,
        allCollections: filteredCollections.sort(sortAlphabetically('name')),
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
