import { Product, ProductName, ProductSlug } from 'types/products'

/**
 * A map of product slugs to their proper noun names.
 */
const productSlugsToNames: { [slug in ProductSlug]: ProductName } = {
  boundary: 'Boundary',
  consul: 'Consul',
  hcp: 'HashiCorp Cloud Platform',
  nomad: 'Nomad',
  packer: 'Packer',
  sentinel: 'Sentinel',
  terraform: 'Terraform',
  vagrant: 'Vagrant',
  vault: 'Vault',
  waypoint: 'Waypoint',
}

/**
 * An array of all Product slugs.
 */
const productSlugs: ProductSlug[] = [
  'boundary',
  'consul',
  'hcp',
  'nomad',
  'packer',
  'sentinel',
  'terraform',
  'vagrant',
  'vault',
  'waypoint',
]

/**
 * Generates an array of Product objects from `productSlugs`.
 */
const products: Product[] = productSlugs.map((slug: ProductSlug) => {
  const name = productSlugsToNames[slug]
  return { name, slug }
})

export { products, productSlugs, productSlugsToNames }
