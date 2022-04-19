import { FeaturedCardProps } from './components/featured-card/types'
import { UseCaseCardProps } from './components/use-case-card/types'

export interface ProductDocsLandingProps {
  /** Content to display on the page */
  content: {
    /** Large text shown at the top of the page */
    pageTitle: string
    /** Descriptive text shown below the pageTitle */
    pageSubtitle: string
    /** A single card with a brand-themed background color */
    featuredCard: FeaturedCardProps
    /** An array of use case cards, each of which can display multiple links. */
    useCaseCards: UseCaseCardProps[]
    /** An array of links to show as cards in a "Developers" section at the bottom of the page. */
    developerCards: { title: string; url: string }[]
  }
}
