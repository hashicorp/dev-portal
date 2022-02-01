import { ProductSlug } from 'types/products'
export interface GetStartedProps {
  product: Exclude<ProductSlug, 'sentinel'>
  heading: string
  text: string
  link: {
    url: string
    text: string
  }
}
