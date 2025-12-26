/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from 'views/docs-view/loaders/remote-content'

type DocsVersionSwitcherOption = VersionSelectItem

interface DocsVersionSwitcherProps {
	options?: DocsVersionSwitcherOption[]
	projectName?: string
}

export type { DocsVersionSwitcherOption, DocsVersionSwitcherProps }
