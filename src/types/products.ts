import { ProductMeta, Products } from '@hashicorp/platform-product-meta'
import { NavigationHeaderItem } from 'components/navigation-header/types'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

/**
 * TODO: put basePaths in a separate interface that extends the Product one?
 */
interface Product extends ProductMeta {
  basePaths?: string[]
  slug: ProductSlug
  navigationHeaderItems: NavigationHeaderItem[]
  url?: string
}

type ProductGroup = Product[]

export type { Product, ProductGroup, ProductSlug }
