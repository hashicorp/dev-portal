import {
	EnrichedLinkNavItem,
	EnrichedNavItem,
	EnrichedSubmenuNavItem,
	LinkNavItemWithMetaData,
	NavItemWithMetaData,
	SubmenuNavItemWithMetaData,
} from 'components/sidebar/types'

interface AddNavItemMetaDataResult {
	foundActiveItem: boolean
	itemsWithMetadata: NavItemWithMetaData[]
}

/**
 * Returns an object for rendering a Badge in a sidebar item if a <sup> tag is
 * found in its title.
 *
 * Examples:
 *
 * getBadgeFromTitle("Audit Log Streaming <sup>BETA</sup>") returns:
 *   {
 *     text: "BETA",
 *     color: "neutral",
 *     type: "outlined",
 *   }
 *
 * getBadgeFromTitle("Audit Log Streaming") returns:
 *   null
 */
const getBadgeFromTitle = (title: string) => {
	let badge = null

	const regex = new RegExp(/<sup>(.*)<\/sup>$/)
	const matches = title.match(regex)
	if (matches && matches.length > 0) {
		const badgeText = matches[1]
		badge = {
			text: badgeText,
			color: 'neutral',
			type: 'outlined',
		}
	}

	return badge
}

/**
 * Handles adding meta data to `Sidebar` `EnrichedNavItem` objects.
 *  - For `EnrichedLinkNavItem` objects, an `isActive` property will be added.
 *  - For `EnrichedSubmenuNavItem` objects:
 *      - a `hasActiveChild` property will be added
 *      - the `routes` property will be updated to be an array of
 *        `NavItemWithMetaData` objects via a recursive call to this function
 *
 * The shape of the returned object is defined as such so that only one nav item
 * is determined to be "active". Once the first "active" item is found, all
 * subsequent items will not be checked for whether or not they're active.
 */
export const addNavItemMetaData = (
	currentPath: string,
	items: EnrichedNavItem[]
): AddNavItemMetaDataResult => {
	// `menuItems` is an optional prop, so nothing to do if `items` is undefined
	let foundActiveItem = false
	if (!items) {
		return { foundActiveItem, itemsWithMetadata: [] }
	}

	const itemsWithMetadata = items.map(
		(item: EnrichedNavItem): NavItemWithMetaData => {
			let itemCopy = { ...item }

			/**
			 * If a `badge` object can be determined from a `title` with `<sup>`,
			 * create the `badge` object and remove the `<sup>` tags from the title.
			 *
			 * This should be in place until all nav data content (including past
			 * versions) no longer contains `<sup>` tags in `title`s.
			 */
			if (item.hasOwnProperty('title')) {
				const itemWithTitle = item as
					| EnrichedSubmenuNavItem
					| EnrichedLinkNavItem
				const badge =
					itemWithTitle.badge ?? getBadgeFromTitle(itemWithTitle.title)
				const title = badge
					? itemWithTitle.title.replace(`<sup>${badge.text}</sup>`, '').trim()
					: itemWithTitle.title

				itemCopy = {
					...itemCopy,
					badge: badge,
					title: title,
				}
			}

			// Found an `EnrichedSubmenuNavItem` object
			if (item.hasOwnProperty('routes')) {
				const result = addNavItemMetaData(
					currentPath,
					(item as EnrichedSubmenuNavItem).routes
				)
				const hasActiveChild = !foundActiveItem && result.foundActiveItem

				foundActiveItem = hasActiveChild || foundActiveItem

				return {
					...itemCopy,
					routes: result.itemsWithMetadata,
					hasActiveChild,
				} as SubmenuNavItemWithMetaData
			}

			// Found an `EnrichedLinkNavItem` object
			if (item.hasOwnProperty('fullPath')) {
				const itemPath = (item as EnrichedLinkNavItem).fullPath
				const isActive =
					!foundActiveItem && itemPath.replace(/\/$/, '') === currentPath

				foundActiveItem = isActive || foundActiveItem

				return {
					...itemCopy,
					isActive,
				} as LinkNavItemWithMetaData
			}

			return itemCopy as NavItemWithMetaData
		}
	)

	return { foundActiveItem, itemsWithMetadata }
}
