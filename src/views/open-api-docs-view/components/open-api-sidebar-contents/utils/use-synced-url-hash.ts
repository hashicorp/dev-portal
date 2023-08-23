import { useEffect } from 'react'
import { useRouteChangeState } from './use-route-change-state'

/**
 * When `activeSection` changes, update the URL hash.
 *
 */
export function useSyncedUrlHash(
	activeSection: string | undefined,
	topOfPageSlug?: string
) {
	const routeState = useRouteChangeState()

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
		 *
		 * One use case is where a hash change for a minor element, such as a
		 * specific property, triggers a scroll into the area of a new active
		 * section. Minor elements are not included in `useActiveSection`, only
		 * major headings are, so updating the hash to the new active section would
		 * erase the hash for the minor element.
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
