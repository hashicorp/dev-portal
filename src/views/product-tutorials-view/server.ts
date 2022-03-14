import { getAllCollections } from 'lib/learn-client/api/collection'
import { Collection as ClientCollection } from 'lib/learn-client/types'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'
import { TutorialPageProduct } from 'views/tutorial-view/server'

export interface ProductTutorialsPageProps {
  collections: ClientCollection[]
  product: TutorialPageProduct
}

export async function getProductTutorialsPageProps(
  product: TutorialPageProduct
): Promise<{ props: ProductTutorialsPageProps }> {
  // @TODO potentially call 'getProduct' here to get description etc from db
  const collections = await getAllCollections({
    product: product.slug,
  })

  return {
    props: {
      collections: stripUndefinedProperties(collections),
      product,
    },
  }
}
