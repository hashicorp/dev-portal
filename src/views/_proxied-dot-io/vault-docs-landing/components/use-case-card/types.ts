import { Products } from '@hashicorp/platform-product-meta'

export interface UseCaseCardProps {
  heading: string
  body: string
  links: {
    title: string
    url: string
  }[]
  productThemeSlug?: Products
}
