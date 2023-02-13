/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'

type DocsVersionSwitcherOption = VersionSelectItem

interface DocsVersionSwitcherProps {
	options?: DocsVersionSwitcherOption[]
	projectName?: string
}

export type { DocsVersionSwitcherOption, DocsVersionSwitcherProps }
