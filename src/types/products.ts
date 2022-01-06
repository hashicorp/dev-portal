import { ProductMeta, Products } from '@hashicorp/platform-product-meta'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

interface Product extends ProductMeta {
  slug: ProductSlug
  url?: string
}

type ProductGroup = Product[]

export type { Product, ProductGroup, ProductSlug }
