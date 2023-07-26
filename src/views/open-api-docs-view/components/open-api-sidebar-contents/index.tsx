import { useMemo } from 'react'
import { useRouter } from 'next/router'
// Lib
import { useActiveSection } from 'lib/hash-links/use-active-section'
// Components
import { SidebarNavMenuItem } from 'components/sidebar/components'
// Types
import type { OpenApiNavItem } from 'views/open-api-docs-view/types'
// Styles
import s from './open-api-sidebar-contents.module.css'

/**
 * Renders sidebar contents for OpenApiDocsView.
 */
export function OpenApiSidebarContents({
	navItems,
}: {
	navItems: OpenApiNavItem[]
}) {
	const { asPath } = useRouter()

	/**
	 * Note next/router `asPath` returns *with* the `#hash`.
	 *
	 * Here, we remove the hash, so that we can compare to the `fullPath`
	 * of each nav item, which are not expected to have hashes,
	 * to the URL path that we're on.
	 *
	 * Note that domain does not matter, as we're just grabbing the hash
	 */
	const urlPathname = useMemo(
		() => new URL(asPath, 'https://www.example.com').pathname,
		[asPath]
	)

	/**
	 * Build an array of section slugs,
	 * and pass these to `useActiveSection`.
	 */
	const sectionSlugs = useMemo(() => {
		return (
			navItems
				.map((item) => {
					// Only grab slugs from link items
					if (!('fullPath' in item)) {
						return null
					}
					// Note that domain does not matter, we're just grabbing the hash
					const { hash } = new URL(item.fullPath, 'https://www.example.com')
					return hash.replace('#', '')
				})
				// Filter out any null or empty string values
				.filter((slug) => typeof slug === 'string' && slug !== '')
		)
	}, [navItems])
	const activeSection = useActiveSection(sectionSlugs)

	/**
	 * Highlight any active matched sidenav items.
	 * These could match `#activeSection` or the full pathname.
	 */
	const navItemsWithActive = useMemo(() => {
		return navItems.map((item) => {
			// Handle dividers, headings, any non-path items
			if (!('fullPath' in item)) {
				return item
			}
			// Handle items with paths, that could be a match
			const isActiveHash = item.fullPath === `#${activeSection}`
			const isActivePath = item.fullPath === urlPathname
			return { ...item, isActive: isActivePath || isActiveHash }
		})
	}, [navItems, activeSection, urlPathname])

	// Render a generic list of `SideBarNavMenuItem`
	return (
		<ul className={s.listResetStyles}>
			{navItemsWithActive.map((item: OpenApiNavItem, index: number) => (
				// eslint-disable-next-line react/no-array-index-key
				<SidebarNavMenuItem item={item} key={index} />
			))}
		</ul>
	)
}
