import { LearnProductData, ProductData } from 'types/products'
import { Product as ClientProduct } from 'lib/learn-client/types'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { filterCollections } from './helpers'

// Some of the product data is coming from the API client on this view
type ProductTutorialsPageProduct = ClientProduct &
  Omit<ProductData, 'name' | 'slug'>

export interface ProductTutorialsPageProps {
  collections: ClientCollection[]
  product: ProductTutorialsPageProduct
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
export async function getProductTutorialsPageProps(
  productData: LearnProductData
): Promise<{ props: ProductTutorialsPageProps }> {
  const productSlug = productData.slug
  const product = await getProduct(productSlug)
  const allProductCollections = await getAllCollections({
    product: { slug: productSlug },
  })
  const filteredCollections = filterCollections(
    allProductCollections,
    productSlug
  )

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
      collections: filteredCollections,
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
