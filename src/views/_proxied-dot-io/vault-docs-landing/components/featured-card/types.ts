import { Products } from '@hashicorp/platform-product-meta'

export interface FeaturedCardProps {
  heading: string
  image: {
    src: string
    alt: string
  }
  body: string
  links: {
    title: string
    url: string
  }[]
  productThemeSlug?: Products
}
