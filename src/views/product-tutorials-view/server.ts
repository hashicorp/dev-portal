import { getAllCollections } from 'lib/learn-client/api/collection'
import { stripUndefinedProperties } from 'lib/strip-undefined-props'

export async function getProductTutorialsPageProps(product) {
  // also call product, incorporate this into the client, to get description etc.
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
