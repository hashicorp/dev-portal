import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'

export interface PackageManager {
  label: string
  commands: string[]
  os: string
}

export interface ProductDownloadsViewProps {
  latestVersion: string
  pageContent: {
    packageManagers: PackageManager[]
    sidecarMarketingCard: SidecarMarketingCardProps
  }
  releases: ReleasesAPIResponse
}
