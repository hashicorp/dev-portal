import { ProductMeta, Products } from '@hashicorp/platform-product-meta'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

/**
 * TODO: put basePaths in a separate interface that extends the Product one?
 */
interface Product extends ProductMeta {
  basePaths?: string[]
  slug: ProductSlug
  url?: string
}

type ProductGroup = Product[]

export type { Product, ProductGroup, ProductSlug }
