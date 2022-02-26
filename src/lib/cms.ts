import rivet from 'rivet-graphql'
import { ProductData, ProductSlug } from 'data/types'
import boundary from 'data/boundary.json'
import consul from 'data/consul.json'
import nomad from 'data/nomad.json'
import sentinel from 'data/sentinel.json'
import vagrant from 'data/vagrant.json'
import vault from 'data/vault.json'
import waypoint from 'data/waypoint.json'

let url = process.env.HASHI_DATO_ENVIRONMENT
  ? `https://graphql.datocms.com/environments/${process.env.HASHI_DATO_ENVIRONMENT}`
  : 'https://graphql.datocms.com'

if (process.env.HASHI_ENV === 'preview') url += '/preview'

const token = process.env.HASHI_DATO_TOKEN || '2f7896a6b4f1948af64900319aed60'

const globalConfig = {
  url,
  headers: { Authorization: token },
}

const productConfig = [
  boundary,
  consul,
  nomad,
  sentinel,
  vagrant,
  vault,
  waypoint,
].reduce((a, b) => {
  a[b.slug] = b
  return a
}, {} as { [key in ProductSlug]: ProductData })

function rivetClient(config: {
  url?: string
  headers?: Record<string, unknown>
}) {
  const clientConfig = {
    ...globalConfig,
    headers: {
      ...globalConfig.headers,
      ...config.headers,
    },
  }

  return rivet(clientConfig.url, {
    headers: clientConfig.headers,
    cors: true,
    retryCount: 3,
  })
}

const instance = rivetClient({})
const client = instance.client

function proxiedRivetClient(productSlug: ProductSlug) {
  console.log(`generating custom rivet client for ${productSlug}`)
  console.log({ keys: Object.keys(productConfig), productSlug })
  const product = productConfig[productSlug]
  console.log({ dataKeys: Object.keys(product) })
  if (product.datoToken) {
    console.log(`returning custom client with token ${product.datoToken}`)
    return rivetClient({ headers: { Authorization: product.datoToken } })
  }

  return instance
}

export default instance
export { client, proxiedRivetClient }
