import { ReactNode } from 'react'
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
		<nav className={s.nav}>
			<ul className={s.ul}>{children}</ul>
		</nav>
	)
}
