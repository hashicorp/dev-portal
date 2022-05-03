import { ProductOption, CompanyLogoOption } from 'lib/learn-client/types'

export { CompanyLogoOption }

export interface CollectionCardProps {
  description: string
  heading: string
  productsUsed: ProductOption[]
  tutorialCount: number
  url: string
  logo?: CompanyLogoOption
}

export type CollectionCardPropsWithId = CollectionCardProps & { id: string }
