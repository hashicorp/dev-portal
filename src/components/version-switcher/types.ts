/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from "views/docs-view/loaders/remote-content"

export interface VersionSwitcherOption {
	ariaLabel: string
	href: string
	isLatest: boolean
	isSelected: boolean
	label: string
	found: VersionSelectItem['found']
}

export interface VersionSwitcherProps {
	label: string
	options: VersionSwitcherOption[]
}
