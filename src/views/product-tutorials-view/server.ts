import { LearnProductData, ProductData } from 'types/products'
import { Product as ClientProduct } from 'lib/learn-client/types'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { formatSidebarCategorySections } from 'views/collection-view/helpers'
import getProductPageContent from './helpers/get-product-page-content'
import { filterCollections, sortAlphabetically } from './helpers'
import { getTutorialsBreadcrumb } from 'views/tutorial-view/utils/get-tutorials-breadcrumb'
import { CollectionLayout } from 'views/collection-view/server'

// Some of the product data is coming from the API client on this view
type ProductTutorialsPageProduct = ClientProduct &
  Omit<ProductData, 'name' | 'slug'>

export interface ProductTutorialsPageProps {
  layoutProps: ProductTutorialsLayout
  pageData: any // @TODO  type this
  collections: ClientCollection[]
  product: ProductTutorialsPageProduct
}

type ProductTutorialsLayout = CollectionLayout

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
export async function getProductTutorialsPageProps(
  productData: LearnProductData
): Promise<{ props: ProductTutorialsPageProps }> {
  const productSlug = productData.slug
  const pageData = await getProductPageContent(productSlug)
  const product = await getProduct(productSlug)
  const allProductCollections = await getAllCollections({
    product: { slug: productSlug, sidebarSort: true },
  })
  const filteredCollections = filterCollections(
    allProductCollections,
    productSlug
  )
  const layoutProps = {
    headings: [{ title: 'Overview', slug: 'overview', level: 1 }],
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
      pageData,
      collections: filteredCollections.sort(sortAlphabetically('name')),
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
