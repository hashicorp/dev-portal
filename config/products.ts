import capitalize from '@hashicorp/platform-util/text/capitalize'
import { ProductGroup, ProductSlug } from 'types/products'

/**
 * Holds the product slugs in the order ProductSwitcher will render them.
 *
 *  - TODO: handle groups to render a horizontal rule
 */
const productSwitcherSlugs = [
  ['terraform', 'packer', 'vagrant'],
  ['vault', 'boundary'],
  ['consul'],
  ['nomad', 'waypoint'],
  ['hcp'],
  ['sentinel'],
]

/**
 * TODO: When the docs links are internal and can be programatically calculated,
 * this will no longer be needed.
 */
const productSlugsToUrls: { [key in ProductSlug]: string } = {
  boundary: 'https://www.boundaryproject.io/docs',
  consul: 'https://www.consul.io/docs',
  hcp: 'https://cloud.hashicorp.com/docs/hcp',
  nomad: 'https://www.nomadproject.io/docs',
  packer: 'https://www.packer.io/docs',
  sentinel: 'https://docs.hashicorp.com/sentinel',
  terraform: 'https://www.terraform.io/docs/index.html',
  vagrant: 'https://www.vagrantup.com/docs',
  vault: 'https://www.vaultproject.io/docs',
  waypoint: '/waypoint',
}

/**
 * Generates an array of Product objects from
 */
const products: ProductGroup[] = productSwitcherSlugs.map((slugGroup) => {
  const productGroup = slugGroup.map((slug: ProductSlug) => {
    const name = slug === 'hcp' ? 'HashiCorp Cloud Platform' : capitalize(slug)
    const url = productSlugsToUrls[slug]
    return {
      name,
      slug,
      url,
    }
  })
  return productGroup
})

export { products }
