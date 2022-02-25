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
    packageManagers: PackageManager[]
    sidecarMarketingCard: SidecarMarketingCardProps
  }
  releases: ReleasesAPIResponse
}
