import OutlineNav from 'components/outline-nav'
import { OutlineLinkItem } from 'components/outline-nav/types'
import {
	getItemSlugs,
	highlightActiveItems,
} from 'components/outline-nav/utils'
import { useDeviceSize } from 'contexts'
import { useActiveSection } from 'lib/hash-links/use-active-section'

/**
 * Given an array of OutlineLinkItems,
 * render an outline nav, and automatically highlight the active item.
 */
function OutlineNavWithActive({ items }: { items: OutlineLinkItem[] }) {
	/**
	 * TODO: isDesktop isn't fully accurate, we may want to adjust this
	 * based on the specific breakpoint at which we show the sidecar.
	 *
	 * Thought: could we monitor the visibility of `OutlineNav` instead,
	 * ie the root element we're rendering in this component?
	 * If it's visible in CSS, then we should enable useActiveSection.
	 * If it's not visible, then we should NOT enable useActiveSection.
	 * Maybe a `useVisibility` hook or something would be useful here.
	 * Maybe this could reduce reliance on specific breakpoint metrics.
	 */
	const { isDesktop } = useDeviceSize()

	/**
	 * Determine the active section. Note we only enable this when the sidecar
	 * is both visible and contains more than one item.
	 */
	const itemSlugs = getItemSlugs(items)
	const hasMultipleItems = itemSlugs.length > 1
	const enableActiveSection = isDesktop && hasMultipleItems
	const activeSection = useActiveSection(itemSlugs, enableActiveSection)

	/**
	 * TODO: actually use activeSection, add isActive props
	 * but memo-ize and only re-calc when activeSection changes.
	 */
	const itemsWithActive = highlightActiveItems(items, `#${activeSection}`)

	return <OutlineNav items={itemsWithActive} />
}

export { OutlineNavWithActive }
