import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'

export interface FeaturedTutorial {
  description: string
  href: string
  title: string
}

export interface PackageManager {
  label: string
  commands: string[]
  os: string
}

export interface ProductDownloadsViewProps {
  latestVersion: string
  pageContent: {
    featuredTutorials: FeaturedTutorial[]
    sidecarMarketingCard: SidecarMarketingCardProps
  }
  releases: ReleasesAPIResponse
}

export interface SortedReleases {
  [os: string]: {
    [arch: string]: string
  }
}
