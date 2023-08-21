// Third-party
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
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
 * When `activeSection` changes, update the URL hash.
 *
 * TODO: split this out.
 */
function useSyncedUrlHash(
	activeSection: string | undefined,
	topOfPageSlug?: string
) {
	/**
	 * TODO: split out `useRouteChangeState` hook.
	 *
	 * In some cases, we may want to manipulate `window.location` outside of
	 * the flow of `next/router`. In those cases, we want to ensure our
	 * manipulation does not conflict with `next/router`.
	 *
	 * This hook helps avoid conflicts by providing state that indicates
	 * whether `next/router` is in the middle of changing the route.
	 *
	 * It also indicates whether the `#hash` was just changed, which is intended
	 * to allow consumers to avoid changing the `#hash` if it has just
	 * been updated by an intentional link click.
	 */
	const router = useRouter()

	const [routeState, setRouteState] = useState<{
		isChanging: boolean
		wasHashJustChanged?: boolean
	}>({
		isChanging: true,
		wasHashJustChanged: false,
	})

	useEffect(() => {
		// On mount, consider the initial route change completed
		setRouteState((p) => ({ ...p, isChanging: false }))

		const handleRouteChangeStart = () =>
			setRouteState({ isChanging: true, wasHashJustChanged: false })
		const handleRouteChangeComplete = () =>
			setRouteState({ isChanging: false, wasHashJustChanged: false })

		const handleHashChangeStart = () =>
			setRouteState({ isChanging: true, wasHashJustChanged: true })
		const handleHashChangeComplete = () =>
			setRouteState({ isChanging: false, wasHashJustChanged: true })

		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
		router.events.on('routeChangeError', handleRouteChangeComplete)

		router.events.on('hashChangeStart', handleHashChangeStart)
		router.events.on('hashChangeComplete', handleHashChangeComplete)

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart)
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
			router.events.off('routeChangeError', handleRouteChangeComplete)

			router.events.off('hashChangeStart', handleHashChangeStart)
			router.events.off('hashChangeComplete', handleHashChangeComplete)
		}
	}, [router])

	/**
	 * When the page is scrolled, we'll update `wasHashJustChanged` to `false`.
	 *
	 * Without this effect, after a hash change, consumers of this effect would
	 * receive inaccurate data that implies a hash change was _just_ completed,
	 * when in fact the user has taken subsequent action.
	 */
	useEffect(() => {
		function scrollEventHandler() {
			if (!routeState.isChanging && routeState.wasHashJustChanged) {
				setRouteState((p) => ({ ...p, wasHashJustChanged: false }))
			}
		}
		window.addEventListener('scroll', scrollEventHandler, { passive: true })
		return () => window.removeEventListener('scroll', scrollEventHandler)
	}, [routeState])

	useEffect(() => {
		// Only run this effect on the client
		if (typeof window === 'undefined') {
			return
		}

		// If active section is undefined, skip this
		if (typeof activeSection === 'undefined') {
			return
		}

		// If next/router is in the middle of a change, skip this effect for now
		if (routeState.isChanging) {
			return
		}

		/**
		 * If we just finished a hash change, trust that, don't try to update it
		 * One use case is where a hash change for a minor element, such as a
		 * specific property, triggers a scroll into the area of a new active
		 * section. Updating the hash to the new active section would erase the
		 * hash for the minor element.
		 */
		if (routeState.wasHashJustChanged) {
			return
		}

		// Get the current URL and hash
		const currentUrl = new URL(window.location.href)
		const currentHash = currentUrl.hash

		/**
		 * If a top-of-page slug was provided and matches,
		 * clear the hash rather than update it.
		 */
		const isFirstSection = activeSection === topOfPageSlug
		const targetSlug = isFirstSection ? '' : activeSection

		/**
		 * If needed, update the hash.
		 *
		 * Note we use `window.history.replaceState` instead of `router.replace`, as
		 * `router.replace` seemed to jump the page even with `{ scroll: false }`.
		 * Ref: https://github.com/vercel/next.js/discussions/35072
		 */
		const needsHashUpdate = currentHash !== `#${targetSlug}`
		if (needsHashUpdate) {
			const updatedUrl = new URL(currentUrl)
			updatedUrl.hash = targetSlug
			window.history.replaceState(null, '', updatedUrl)
		}
	}, [activeSection, topOfPageSlug, routeState])
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
	navItems: OpenApiNavItem[],
	enable: boolean = true,
	defaultSection?: string
): OpenApiNavItem[] {
	// Transform the incoming nav items into section slugs
	const sectionSlugs = useMemo(
		() => sectionSlugsFromNavItems(navItems),
		[navItems]
	)

	// Determine which of the navItem sectionsSlugs is the active section slug
	const activeSection = useActiveSection(sectionSlugs, true, defaultSection)

	// When the active section changes, update the URL with the current #hash
	useSyncedUrlHash(activeSection, defaultSection)

	// Get the URL pathname (without the `#hash`) needed for full path matching
	const urlPathname = usePathname()

	// Activate nav items that match either the active section or the full path
	const navItemsWithActive = useMemo(() => {
		return navItems.map((item: OpenApiNavItem) =>
			getNavItemWithActive(item, activeSection, urlPathname)
		)
	}, [navItems, activeSection, urlPathname])

	/**
	 * Allow a dynamic escape hatch, to avoid  highlighting items.
	 * For context, there are cases such as during sidebar filtering where
	 * we want to avoid highlighting items. Note that due to React's rules
	 * around hooks, this conditional has to happen after the hooks above.
	 */
	if (!enable) {
		return navItems
	}

	// Return nav items with `isActive` properties
	return navItemsWithActive
}
