import { ProductData } from 'types/products'
import { getAllCollections } from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import {
  Collection as ClientCollection,
  ProductOption,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { filterCollections } from './helpers'

export interface ProductTutorialsPageProps {
  collections: ClientCollection[]
  product: ProductData
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
  productData: ProductData
): Promise<{ props: ProductTutorialsPageProps }> {
  const productSlug = productData.slug
  const product = await getProduct(productSlug)
  const allProductCollections = await getAllCollections({
    product: productSlug as ProductOption,
  })
  const filteredCollections = filterCollections(
    allProductCollections,
    productSlug
  )

  return {
    props: stripUndefinedProperties({
      collections: filteredCollections,
      product: { ...product, ...productData },
    }),
  }
}
