import { ReleasesAPIResponse } from 'lib/fetch-release-data'

export interface ProductDownloadsViewProps {
  latestVersion: string
  pageContent: {
    packageManagers: {
      label: string
      commands: string[]
      os: string
    }[]
  }
  releases: ReleasesAPIResponse
}
