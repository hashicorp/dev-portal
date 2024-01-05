/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	GroupedPackageManagers,
	PackageManager,
} from 'views/product-downloads-view/types'

export const generateCodeSnippetFromCommands = (
	commands: PackageManager['commands']
): string => {
	return commands.map((command: string) => `$ ${command}`).join('\n')
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
