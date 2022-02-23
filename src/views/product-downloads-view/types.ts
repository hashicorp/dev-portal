import { ReleasesAPIResponse } from 'lib/fetch-release-data'

export interface PackageManager {
  label: string
  commands: string[]
  os: string
}

export interface ProductDownloadsViewProps {
  latestVersion: string
  pageContent: {
    packageManagers: PackageManager[]
  }
  releases: ReleasesAPIResponse
}
