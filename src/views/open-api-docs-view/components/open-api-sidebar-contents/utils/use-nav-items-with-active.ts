// Third-party
import { useRouter } from 'next/router'
import { useMemo } from 'react'
// Lib
import { useActiveSection } from 'lib/hash-links/use-active-section'
import newUrl from 'lib/new-url'
// Types
import type { OpenApiNavItem } from 'views/open-api-docs-view/types'

/**
 * Note next/router `asPath` returns *with* the `#hash`.
 *
 * Here, we remove the hash, so that we can compare to the `fullPath`
 * of each nav item, which are not expected to have hashes,
 * to the URL path that we're on.
 *
 * Note that domain does not matter, as we're just grabbing the full path.
 */
function usePathname() {
	const { asPath } = useRouter()
	return useMemo(() => newUrl(asPath).pathname, [asPath])
}

/**
 * Given a `navItem`, an `#active-section-slug`, and the full `/url/path`,
 * Return the `navItem` with an `isActive` property where appropriate.
 *
 * The `isActive` property will only be added to `navItem` objects
 * that have a `fullPath` property. Other objects are returned unaffected.
 *
 * The `isActive` property is true if the `navItem.fullPath` matches either the
 * `#active-section-slug` or the full `/url/path`. Otherwise, it is false.
 */
function getNavItemWithActive(
	navItem: OpenApiNavItem,
	activeSection: string,
	urlPathname: string
): OpenApiNavItem {
	// Handle dividers, headings, any non-path items
	if (!('fullPath' in navItem)) {
		return navItem
	}
	// Handle items with paths, that could be a match
	const isActiveHash = navItem.fullPath === `#${activeSection}`
	const isActivePath = navItem.fullPath === urlPathname
	return { ...navItem, isActive: isActivePath || isActiveHash }
}

/**
 * Extract an array of section slugs from an array of `navItems`.
 *
 * Section slugs are the `#hash` values from `navItems` that have a `fullPath`.
 * `navItems` that do not have a `fullPath` or have a `fullPath` with an empty
 * `#hash` slug value are ignored. `#hash` slugs are returned without the `#`.
 */
function sectionSlugsFromNavItems(navItems: OpenApiNavItem[]): string[] {
	return (
		navItems
			.map((item: OpenApiNavItem) => {
				// Only grab slugs from link items
				if (!('fullPath' in item)) {
					return null
				}
				// Grab the `#hash-slug` without `#`
				return newUrl(item.fullPath).hash.replace('#', '')
			})
			// Filter out any null or empty string values
			.filter((slug: string | null) => typeof slug === 'string' && slug !== '')
	)
}

/**
 * Highlight any active matched sidenav items.
 * These could match `#activeSection` or the full pathname.
 *
 * Note that if there are no `#hash` links in `navItems`, then the
 * `useActiveSection` hook will not set up any IntersectionObservers,
 * and the `activeSection` variable will be `undefined`. The highlighting
 * of standard link matches will still function as expected.
 */
export function useNavItemsWithActive(
	navItems: OpenApiNavItem[]
): OpenApiNavItem[] {
	// Transform the incoming nav items into section slugs
	const sectionSlugs = useMemo(
		() => sectionSlugsFromNavItems(navItems),
		[navItems]
	)

	// Determine which of the navItem sectionsSlugs is the active section slug
	const activeSection = useActiveSection(sectionSlugs)

	// Get the URL pathname (without the `#hash`) needed for full path matching
	const urlPathname = usePathname()

	// Activate nav items that match either the active section or the full path
	const navItemsWithActive = useMemo(() => {
		return navItems.map((item: OpenApiNavItem) =>
			getNavItemWithActive(item, activeSection, urlPathname)
		)
	}, [navItems, activeSection, urlPathname])

	// Return nav items with `isActive` properties
	return navItemsWithActive
}
