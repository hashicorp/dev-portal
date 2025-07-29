/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'
import { ProductWithCurrentRootDocsPath } from 'types/products'
import { getTargetPath } from 'lib/get-target-path'
import { getVersionFromPath } from 'lib/get-version-from-path'
import { removeVersionFromPath } from 'lib/remove-version-from-path'
import { useCurrentProduct } from 'contexts'
import useCurrentPath from 'hooks/use-current-path'
import VersionSwitcher, {
	VersionSwitcherOption,
} from 'components/version-switcher'
import { DocsVersionSwitcherOption, DocsVersionSwitcherProps } from './types'

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Construct a project name to be used in ariaLabels for each option.
 */
export function setProjectForAriaLabel(
	projectName,
	currentRootDocsPath,
	currentProduct
) {
	let projectNameForLabel: string
	if (projectName) {
		projectNameForLabel = projectName
	} else {
		const docsName = currentRootDocsPath.shortName ?? currentRootDocsPath.name
		projectNameForLabel = docsName.includes(currentProduct.name)
			? docsName
			: `${currentProduct.name} ${docsName}`
	}
	return projectNameForLabel
}
/**
 * Render a docs version switcher directly from loaded `VersionSelectItem`s,
 * wrapping a generic `VersionSwitcher` in docs-related logic.
 */
const DocsVersionSwitcher = ({
	options,
	projectName,
}: DocsVersionSwitcherProps) => {
	const currentProduct = useCurrentProduct() as ProductWithCurrentRootDocsPath
	const currentPath = useCurrentPath({ excludeHash: true, excludeSearch: true })

	// Check if `currentRootDocsPath` is set
	const currentRootDocsPath = currentProduct.currentRootDocsPath
	if (!currentRootDocsPath) {
		if (IS_DEV) {
			console.error(
				`DocsVersionSwitcher requires 'currentRootDocsPath' to be set on 'currentProduct'. Make sure 'rootDocsPaths' is configured in 'src/data/${currentProduct.slug}.json'.`
			)
		}
		return null
	}

	/**
	 * Find the selected option, either by parsing a version from the path,
	 * or fallback to latest (for non-versioned URLs).
	 */
	const selectedVersion = getVersionFromPath(currentPath)
	let selectedOption: DocsVersionSwitcherOption
	if (selectedVersion) {
		selectedOption = options.find(
			(option: DocsVersionSwitcherOption) => option.version === selectedVersion
		)
	} else {
		// Fall back to selecting the latest version
		selectedOption = options.find(
			(option: VersionSelectItem) => option.isLatest === true
		)
		// In some edge cases, there may be no latest version, such as for
		// versioned docs that no longer exist in the latest version. For these
		// cases, fallback to selecting the first option.
		if (!selectedOption) {
			selectedOption = options[0]
		}
	}

	const projectNameForLabel = setProjectForAriaLabel(
		projectName,
		currentRootDocsPath,
		currentProduct
	)

	/**
	 * Encode docs concerns into the `options` to pass to `VersionSwitcher`.
	 */
	const optionsForVersionSwitcher = options.map(
		(option: VersionSelectItem): VersionSwitcherOption => {
			// Destructure properties we'll pass through
			const { label, isLatest } = option
			// Determine if this option is selected
			const isSelected = option.version === selectedOption.version
			// Build the href for the option
			const href = option.isLatest
				? removeVersionFromPath(currentPath)
				: getTargetPath({
						basePath: `${currentProduct.slug}/${currentRootDocsPath.path}`,
						asPath: option.href || currentPath,
						version: option.version,
				  })
			// Build the aria-label for the Activator when this option is selected.
			const ariaLabel = `Choose a ${projectNameForLabel} version. Currently viewing ${label}.`
			// Return the VersionSwitcherOption
			return { label, href, isSelected, isLatest, ariaLabel }
		}
	)

	return (
		<VersionSwitcher
			label={projectName ?? currentProduct.name}
			options={optionsForVersionSwitcher}
		/>
	)
}

export type { DocsVersionSwitcherProps }
export default DocsVersionSwitcher
