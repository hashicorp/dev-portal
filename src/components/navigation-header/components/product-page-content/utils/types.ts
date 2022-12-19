import { PrimaryNavLinkProps } from '../../primary-nav-link'
import { PrimaryNavSubmenuProps } from '../../primary-nav-submenu'

export type NavItem =
	| PrimaryNavLinkProps['navItem']
	| PrimaryNavSubmenuProps['navItem']
