/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import s from './nav-bar-list-container.module.css'

/**
 * Renders a <ul /> flex container reset list-styles, within a <nav /> element
 * that is not shown at viewports widths where the mobile menu is visible.
 *
 * Intended for re-use in rendering lists of top-nav links.
 */
export default function NavBarListContainer({
	children,
}: {
	/**
	 * Important: children should be `<li />` items,
	 * as they're rendered into a `<ul />` container.
	 */
	children: ReactNode
}) {
	return (
		<NavigationMenu.Root className={s.nav}>
			<ul className={s.ul}>{children}</ul>
		</NavigationMenu.Root>
	)
}
