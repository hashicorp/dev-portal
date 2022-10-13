import { PackageManager } from './types'
import highlightString from '@hashicorp/platform-code-highlighting/highlight-string'
import { generateCodeSnippetFromCommands } from './components/downloads-section/helpers'

export const generatePackageManagers = async ({
	defaultPackageManagers,
	packageManagerOverrides,
}: {
	defaultPackageManagers: PackageManager[]
	packageManagerOverrides: PackageManager[]
}): Promise<PackageManager[]> => {
	let packageManagers: PackageManager[]

	/**
	 * Incorporate packageManagerOverrides into the provided defaults
	 */
	if (packageManagerOverrides) {
		packageManagers = defaultPackageManagers.map((defaultPackageManager) => {
			const override = packageManagerOverrides.find(
				({ os, label }) =>
					os === defaultPackageManager.os &&
					label === defaultPackageManager.label
			)
			return override || defaultPackageManager
		})
	} else {
		packageManagers = defaultPackageManagers
	}

	/**
	 * For each package manager, build a highlighted HTML string from `commands`,
	 * for use in installation command code blocks.
	 */
	const packageManagersWithInstallCode = await Promise.all(
		packageManagers.map(async (packageManager) => {
			const { commands } = packageManager
			const installCodeHtml = await highlightString(
				generateCodeSnippetFromCommands(commands),
				'shell-session'
			)
			return { ...packageManager, installCodeHtml }
		})
	)

	return packageManagersWithInstallCode
}
