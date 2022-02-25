import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'

export interface FeaturedTutorial {
  description: string
  href: string
  title: string
}

export interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
  pageContent: {
    featuredTutorials: FeaturedTutorial[]
    sidecarMarketingCard: SidecarMarketingCardProps
  }
}
