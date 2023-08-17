/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * When the #hash in the page URL changes, or a relevant anchor link is clicked,
 * react accordingly by calling `handleUserContentHash`, which jumps to
 * `user-content-` anchor links even if the hash in the URL or `href` does
 * not explicitly contain the `user-content-` prefix.
 *
 * Note this is necessary for sanitized markdown content, as `id` attributes
 * are automatically prefixed with "user-content-" by `rehype-sanitize`.
 * Despite this `id` sanitization, we want users to share and use hash URLs
 * without the `user-content-` prefix. On the same note, for our own convenience
 * in implementation, we want to be able to create links to `#hashes` without
 * worrying about the effects of sanitization.
 *
 * This solution is adapted for NextJS based on the `rehype-sanitize` example:
 * https://github.com/rehypejs/rehype-sanitize/blob/main/readme.md#example-headings-dom-clobbering
 * (If link breaks, search `scrollIntoView` on the `rehype-sanitize` readme).
 */
function useUserContentAnchorLinks() {
	const { asPath } = useRouter()

	/**
	 * Handle when the hash changes, such as on initial load.
	 *
	 * Note that in order for `asPath` events to be triggered, all anchor links
	 * should use the `Link` component from `next/link`. Using a plain `<a />`
	 * tag does not seem to trigger the `next/router` change we expect.
	 */
	useEffect(() => {
		const hash = hashFromUrlString(asPath)
		handleUserContentHash(hash)
	}, [asPath])

	/**
	 * Handle click events, which may not trigger hash _changes_,
	 * such as when scrolling away, then clicking again on the existing hash.
	 *
	 * We handle clicks anywhere in the document, so that this hook does the work,
	 * Otherwise, we'd likely have to change behaviour in any individual
	 * components that might be intended to link to a `#user-content-` element.
	 */
	useEffect(() => {
		function handleClick({ target }: MouseEvent) {
			// We only care about elements for which we can find the closest anchor
			const closestAnchor = target instanceof Element && target.closest('a')
			if (!closestAnchor) {
				return
			}
			// We only react to anchor element clicks that re-set the current location
			// Anchor element clicks that _change_ the location.href hash will be
			// handled by our `asPath` based useEffect.
			const isRelevantAnchor = closestAnchor.href === location.href
			if (!isRelevantAnchor) {
				return
			}
			// Knowing we're dealing with the anchor element that was just clicked
			// to re-set the current location.href, handle the hash from that href.
			const hash = hashFromUrlString(closestAnchor.href)
			handleUserContentHash(hash)
		}
		// Add the click listener on the document, and set up useEffect cleanup
		document.addEventListener('click', handleClick, false)
		return function cleanup() {
			document.addEventListener('click', handleClick, false)
		}
	})
}

/**
 * Handle a hash change or click that _may_ be a `user-content-` hash.
 *
 * If an element with id="user-content-hash" is found,
 * we scroll that element into view.
 *
 * If an element with #user-content-hash can't be found,
 * nothing happens.
 */
function handleUserContentHash(hash: string) {
	// Safeguard against non-string values or empty strings
	if (typeof hash !== 'string' || hash === '') {
		return
	}
	// Try to find, and jump to, an element with the provided `user-content` hash
	const target = document.getElementById(`user-content-${hash}`)
	if (target) {
		setTimeout(() => {
			target.scrollIntoView()
		}, 0)
	}
}

/**
 * Given a string representing a URL,
 * Return the `#hash` from that string, without the `#`,
 * or an empty string if no `#hash` is parsed.
 */
function hashFromUrlString(path: string): string {
	return path.split('#')[1] || ''
}

export default useUserContentAnchorLinks
