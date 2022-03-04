import {
  ContextSwitcherOption,
  VersionContextSwitcherProps,
} from 'components/version-context-switcher'
import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-downloads-view/types'

export interface DownloadsSectionProps {
  latestVersionIsSelected: boolean
  packageManagers: PackageManager[]
  onVersionChange: (newValue: ContextSwitcherOption['value']) => void
  selectedRelease: ReleaseVersion
  versionSwitcherOptions: VersionContextSwitcherProps['options']
}
