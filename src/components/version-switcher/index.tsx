/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import DropdownDisclosure, {
	DropdownDisclosureLabelItem,
	DropdownDisclosureAnchorItem,
} from 'components/dropdown-disclosure'
import { VersionSwitcherProps, VersionSwitcherOption } from './types'
import s from './version-switcher.module.css'

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Renders version links in a `Dropdown` within a `nav` element.
 */
function VersionSwitcher({ options, label }: VersionSwitcherProps) {
	// Render `null` if there aren't any options
	if (!options || options.length === 0) {
		if (IS_DEV) {
			console.warn('VersionSwitcher has no `options` to render.')
		}
		return null
	}

	// Get the selected option, shown on the disclosure activator
	const selectedOption = options.find(
		(option: VersionSwitcherOption) => option.isSelected
	)

	return (
		<nav>
			<DropdownDisclosure
				aria-label={selectedOption.ariaLabel}
				className={s.root}
				text={selectedOption.label}
				color="secondary"
				listPosition="right"
			>
				<DropdownDisclosureLabelItem>{label}</DropdownDisclosureLabelItem>
				{options
					// Hide currently selected version from dropdown list
					.filter((option: VersionSwitcherOption) => !option.isSelected)
					// Render an anchor item for each option
					.map((option: VersionSwitcherOption) => {
						return (
							<DropdownDisclosureAnchorItem
								key={option.href}
								href={option.href}
								rel={option.isLatest ? undefined : 'nofollow'}
							>
								{option.label}
							</DropdownDisclosureAnchorItem>
						)
					})}
			</DropdownDisclosure>
		</nav>
	)
}

export type { VersionSwitcherProps, VersionSwitcherOption }
export default VersionSwitcher
