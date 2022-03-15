import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { NavigationHeaderItem } from 'components/navigation-header/types'
import { MenuItem } from 'components/sidebar'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

/**
 * TODO: put basePaths in a separate interface that extends the Product one?
 */
interface Product extends ProductMeta {
  basePaths?: string[]
  name: string
  navigationHeaderItems?: NavigationHeaderItem[]
  sidebar?: {
    landingPageNavData: MenuItem[]
    resourcesNavData: MenuItem[]
  }
  slug: ProductSlug
  url?: string
}

type ProductGroup = Product[]

export type { Product, ProductGroup, ProductSlug }
