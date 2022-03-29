import { getAllCollections } from 'lib/learn-client/api/collection'
import { getProduct } from 'lib/learn-client/api/product'
import {
  Collection as ClientCollection,
  ProductOption,
  Product as ClientProduct,
} from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { filterCollections } from './helpers'

export interface ProductTutorialsPageProps {
  collections: ClientCollection[]
  product: ClientProduct
}

/** @TODO add sidebar sort capability */

export async function getProductTutorialsPageProps(
  productSlug: ProductOption
): Promise<{ props: ProductTutorialsPageProps }> {
  const product = await getProduct(productSlug)
  const allProductCollections = await getAllCollections({
    product: productSlug,
  })
  const filteredCollections = filterCollections(
    allProductCollections,
    productSlug
  )

  return {
    props: stripUndefinedProperties({
      collections: filteredCollections,
      product,
    }),
  }
}
