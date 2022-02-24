import { ReleaseVersion } from 'lib/fetch-release-data'
import { PackageManager } from 'views/product-downloads-view/types'
import { sortPlatforms } from 'views/product-downloads-view/helpers'

export const generateCodePropFromCommands = (
  commands: PackageManager['commands']
): string => {
  return commands.map((command: string) => `$ ${command}`).join('\n')
}

export const groupDownloadsByOS = (selectedRelease: ReleaseVersion) => {
  return sortPlatforms(selectedRelease)
}

export const groupPackageManagersByOS = (packageManagers: PackageManager[]) => {
  const result = {}

  packageManagers.forEach((packageManager) => {
    const { os } = packageManager
    if (result[os]) {
      result[os].push(packageManager)
    } else {
      result[os] = [packageManager]
    }
  })

  return result
}
