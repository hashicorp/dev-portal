/**
 * waypointproject.io
 * vaultproject.io
 *
 * docs ---> waypoint/docs/...
 * api --> vault/api-docs
 */
import path from 'path'
import { ProductSlug } from 'types/products'

export const PRODUCT_DOCS_PATHS = {
  boundary: 'www.boundaryproject.io',

  consul: 'www.consul.io',

  nomad: 'www.nomadproject.io',

  packer: 'www.packer.io',

  sentinel: 'docs.hashicorp.com',

  terraform: 'terraform.io',

  vagrant: 'www.vagrantup.com',

  vault: 'www.vaultproject.io',

  waypoint: 'www.waypointproject.io',
}

export function handleDocsLink(nodePath: string, product: ProductSlug) {
  let finalPath = path.join(`/${product}`, nodePath).replace('.html', '')
  const isApiDocsPath = finalPath.includes('/api/')

  if (isApiDocsPath) {
    finalPath = finalPath.replace('/api/', '/api-docs/')
  }

  console.log({ nodePath }, { finalPath })

  return finalPath
}
