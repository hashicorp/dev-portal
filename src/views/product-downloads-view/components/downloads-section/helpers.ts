import { ReleaseVersion } from 'lib/fetch-release-data'
import {
	GroupedPackageManagers,
	PackageManager,
	SortedReleases,
} from 'views/product-downloads-view/types'
import { sortPlatforms } from 'views/product-downloads-view/helpers'

export const generateCodeSnippetFromCommands = (
	commands: PackageManager['commands']
): string => {
	return commands.map((command: string) => `$ ${command}`).join('\n')
}

export const groupDownloadsByOS = (
	selectedRelease: ReleaseVersion
): SortedReleases => {
	return sortPlatforms(selectedRelease)
}

export const groupPackageManagersByOS = (
	packageManagers: PackageManager[]
): GroupedPackageManagers => {
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
