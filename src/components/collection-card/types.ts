import type { ProductSlug } from 'types/products'
import type { CompanyLogoOption } from 'components/tutorial-collection-cards'

export interface CollectionCardProps {
  description: string
  heading: string
  productsUsed: ProductSlug[]
  tutorialCount: number
  url: string
  logo?: CompanyLogoOption
}
