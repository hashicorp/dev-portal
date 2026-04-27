/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import classNames from 'classnames'
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
	const iaPosthogVariant = true // TODO: Replace with actual PostHog experiment variant check when available
	return (
		<NavigationMenu.Root
			className={classNames(s.nav, {
				[s.iaPosthogVariantNav]: iaPosthogVariant,
			})}
		>
			<NavigationMenu.List
				className={classNames(s.ul, {
					[s.iaPosthogVariantUl]: iaPosthogVariant,
				})}
			>
				{children}
			</NavigationMenu.List>
		</NavigationMenu.Root>
	)
}
