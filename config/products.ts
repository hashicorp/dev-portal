import { ProductGroup, ProductName, ProductSlug } from 'types/products'

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
 * Holds the product slugs in the order ProductSwitcher will render them.
 */
const productSwitcherSlugs: ProductSlug[][] = [
  ['terraform', 'packer', 'vagrant'],
  ['vault', 'boundary'],
  ['consul'],
  ['nomad', 'waypoint'],
  ['hcp'],
  ['sentinel'],
]

/**
 * Generates a 2D array of Product objects from `productSwitcherSlugs`.
 */
const products: ProductGroup[] = productSwitcherSlugs.map(
  (slugGroup: ProductSlug[]) => {
    const productGroup = slugGroup.map((slug: ProductSlug) => {
      const name = productSlugsToNames[slug]
      return {
        name,
        slug,
      }
    })
    return productGroup
  }
)

export { products }
