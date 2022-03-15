import { ProductSlug } from 'types/products'
export interface GetStartedProps {
  product: ProductSlug
  heading: string
  text: string
  link: {
    url: string
    text: string
  }
}
