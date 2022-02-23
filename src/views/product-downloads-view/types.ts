import { ReleasesAPIResponse } from 'lib/fetch-release-data'

export interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
}
