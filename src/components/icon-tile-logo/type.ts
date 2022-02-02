import { ProductSlug } from 'types/products'

export interface IconTileLogoProps {
  product: Exclude<ProductSlug, 'sentinel'>
}
