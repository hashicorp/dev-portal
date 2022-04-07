import { Products } from '@hashicorp/platform-product-meta'
import { FeaturedCardProps } from './components/featured-card/types'
import { UseCaseCardProps } from './components/use-case-card/types'

export interface ProductDocsLandingProps {
  content: {
    pageTitle: string
    pageSubtitle: string
    featuredCard: FeaturedCardProps
    useCaseCards: UseCaseCardProps[]
    developerCards: { title: string; url: string }[]
  }
  /** Used for theming. Should be a valid "Products" from @hashicorp/platform-product-meta. */
  themeSlug: string | Products
}
