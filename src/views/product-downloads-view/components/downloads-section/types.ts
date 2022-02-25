import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-downloads-view/types'

export interface DownloadsSectionProps {
  latestVersionIsSelected: boolean
  packageManagers: PackageManager[]
  selectedRelease: ReleaseVersion
}
