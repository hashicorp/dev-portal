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
import { useMemo } from 'react'
import { Root as Alert } from '@hashicorp/react-design-system-components/src/components/alert';

const IS_DEV = process.env.NODE_ENV !== 'production'

/**
 * Renders version links in a `Dropdown` within a `nav` element.
 */
function VersionSwitcher({ options, label }: VersionSwitcherProps) {
	const firstNotFoundIndex = useMemo(() => {
		return options.findIndex((option) => option.found === false)
	}, [options])
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
					.map((option: VersionSwitcherOption, index: number) => {
						return [
							// If the next version is missing, then render a message to explain
							(index + 1 === firstNotFoundIndex) ? (
								<DropdownDisclosureLabelItem>
									<Alert
										type="compact"
										color='critical'
										key="no-previous-versions"
										description={`No versions of this document exist before ${options[firstNotFoundIndex-1].label}. Click below to redirect to the version homepage.`}
										role='alert'
									/>
									</DropdownDisclosureLabelItem>
							) : null,
							<DropdownDisclosureAnchorItem
								key={option.href}
								href={option.href}
								rel={option.isLatest ? undefined : 'nofollow'}
							>
								{option.label}
							</DropdownDisclosureAnchorItem>,
						]
					})}
			</DropdownDisclosure>
		</nav>
	)
}

export type { VersionSwitcherProps, VersionSwitcherOption }
export default VersionSwitcher
