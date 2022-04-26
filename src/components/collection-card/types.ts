import { ProductOption } from 'lib/learn-client/types'
import { CompanyLogoOption } from './components/company-logo/types'

export { CompanyLogoOption }
export interface CollectionCardProps {
  description: string
  heading: string
  productsUsed: ProductOption[]
  tutorialCount: number
  url: string
  logo?: CompanyLogoOption
}
