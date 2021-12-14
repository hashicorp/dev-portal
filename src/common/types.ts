import { ProductMeta, Products } from '@hashicorp/platform-product-meta'

type ProductSlug = Exclude<Products, 'hashicorp'> | 'hcp' | 'sentinel'

interface Product extends ProductMeta {
  url: string
}

export type { Product, ProductSlug }
