import { ProductSlug } from 'types/products'

type SvgElementProps = JSX.IntrinsicElements['svg']

export interface ProductIconProps extends SvgElementProps {
  productSlug: ProductSlug
}
