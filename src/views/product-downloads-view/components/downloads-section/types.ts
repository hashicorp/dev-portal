import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-downloads-view/types'

export interface DownloadsSectionProps {
  packageManagers: PackageManager[]
  selectedRelease: ReleaseVersion
}
