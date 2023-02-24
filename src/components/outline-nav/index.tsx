import { useId } from '@react-aria/utils'
import { OutlineListItems } from './components'
import type { OutlineNavProps } from './types'
import s from './outline-nav.module.css'

/**
 * Render a <nav> element, with an "On this page" label,
 * and an ordered list of links. Intended for use with #jump-links.
 */
function OutlineNav({ items }: OutlineNavProps) {
	const uniqueId = useId()

	return (
		<nav aria-labelledby={uniqueId}>
			<p id={uniqueId} className={s.navLabel}>
				On this page:
			</p>
			<ol className={s.listRoot}>
				<OutlineListItems items={items} />
			</ol>
		</nav>
	)
}

export type { OutlineNavProps }
export default OutlineNav
