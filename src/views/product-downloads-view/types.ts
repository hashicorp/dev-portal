import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import { SidecarMarketingCardProps } from './components/sidecar-marketing-card'

export interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
  pageContent: {
    sidecarMarketingCard: SidecarMarketingCardProps
  }
}
