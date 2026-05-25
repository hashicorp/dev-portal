/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

import { PrimaryNavLinkProps } from '../../primary-nav-link'
import { PrimaryNavSubmenuProps } from '../../primary-nav-submenu'

export type NavItem =
	| PrimaryNavLinkProps['navItem']
	| PrimaryNavSubmenuProps['navItem']
