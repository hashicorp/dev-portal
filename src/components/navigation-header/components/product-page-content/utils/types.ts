/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { PrimaryNavLinkProps } from '../../primary-nav-link'
import { PrimaryNavSubmenuProps } from '../../primary-nav-submenu'

export type NavItem =
	| PrimaryNavLinkProps['navItem']
	| PrimaryNavSubmenuProps['navItem']
