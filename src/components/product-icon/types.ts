import { HTMLProps } from 'react'
import { ProductSlug } from 'types/products'

export interface ProductIconProps extends HTMLProps<SVGSVGElement> {
  product: ProductSlug
}
