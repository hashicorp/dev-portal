import { Product, ProductData, ProductName, ProductSlug } from 'types/products'
// product data
import boundaryProductData from 'data/boundary.json'
import consulProductData from 'data/consul.json'
import nomadProductData from 'data/nomad.json'
import sentinelProductData from 'data/sentinel.json'
import vagrantProductData from 'data/vagrant.json'
import vaultProductData from 'data/vault.json'
import waypointProductData from 'data/waypoint.json'

/**
 * A map of product slugs to their proper noun names.
 *
 * 🚨 NOTE: the order of this object matters for the Home page.
 */
const productSlugsToNames: { [slug in ProductSlug]: ProductName } = {
  sentinel: 'Sentinel',
  hcp: 'HashiCorp Cloud Platform',
  terraform: 'Terraform',
  packer: 'Packer',
  consul: 'Consul',
  vault: 'Vault',
  boundary: 'Boundary',
  nomad: 'Nomad',
  waypoint: 'Waypoint',
  vagrant: 'Vagrant',
}

/**
 * A map of product slugs to their product data
 */
const productSlugsToProductData = [
  boundaryProductData,
  consulProductData,
  nomadProductData,
  sentinelProductData,
  vagrantProductData,
  vaultProductData,
  waypointProductData,
].reduce((a, b) => {
  a[b.slug] = b
  return a
}, {} as { [key in ProductSlug]: ProductData })

/**
 * Type guard to determine if a string is a ProductSlug
 *
 * TODO: should we define ProductSlug as an enum,
 * so that we can use its values directly here?
 */
function isProductSlug(string: string): string is ProductSlug {
  return Object.keys(productSlugsToNames).includes(string as ProductSlug)
}

/**
 * An array of all Product slugs, generated from `productSlugsToNames`.
 */
const productSlugs = Object.keys(productSlugsToNames) as ProductSlug[]

/**
 * Generates an array of Product objects from `productSlugs`.
 */
const products: Product[] = productSlugs.map((slug: ProductSlug) => {
  const name = productSlugsToNames[slug]
  return { name, slug }
})

export {
  isProductSlug,
  products,
  productSlugs,
  productSlugsToNames,
  productSlugsToProductData,
}
