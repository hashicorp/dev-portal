import capitalize from '@hashicorp/platform-util/text/capitalize'
import { ProductGroup, ProductSlug } from 'types/products'

/**
 * Holds the product slugs in the order ProductSwitcher will render them.
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
 * Generates an array of Product objects from
 */
const products: ProductGroup[] = productSwitcherSlugs.map((slugGroup) => {
  const productGroup = slugGroup.map((slug: ProductSlug) => {
    const name = slug === 'hcp' ? 'HashiCorp Cloud Platform' : capitalize(slug)
    const url = `/${slug}`
    return {
      name,
      slug,
      url,
    }
  })
  return productGroup
})

export { products }
