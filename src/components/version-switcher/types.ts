/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export interface VersionSwitcherOption {
	ariaLabel: string
	href: string
	isLatest: boolean
	isSelected: boolean
	label: string
}

export interface VersionSwitcherProps {
	label: string
	options: VersionSwitcherOption[]
}
