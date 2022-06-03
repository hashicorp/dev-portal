import { ProductSlug } from 'types/products'

export interface IconTileLogoProps {
  productSlug: Exclude<ProductSlug, 'sentinel'>
  className?: string
}
