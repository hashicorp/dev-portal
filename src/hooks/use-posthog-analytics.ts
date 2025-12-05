/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'

// SSR-safe dynamic import
let posthog: typeof import('posthog-js').default | null = null
if (typeof window !== 'undefined') {
	import('posthog-js').then((module) => {
		posthog = module.default
	})
}

declare global {
	/* 
	Loaded via a posthog script tag in GTM based on datagrail consent
	*/
	interface Window {
		posthog?: typeof import('posthog-js').PostHog
	}
}

function onRouteChangeComplete() {
	/**
	 * PostHog automatically captures a `pageview` for initial page loads.
	 * Subsequent client-side navigation events have to be captured manually,
	 * which is why we have to set up this `onRouteChangeComplete` event.
	 *
	 * PostHog documentation for capturing pageviews in SPA with the JS web installation:
	 * https://posthog.com/docs/libraries/js#single-page-apps-and-pageviews
	 */
	if (posthog) {
		posthog.capture('$pageview')
	}
}

/**
 * Enables PostHog page view tracking on route changes
 */
export default function usePostHogPageAnalytics(): void {
	const router = useRouter()

	useEffect(() => {
		// SSR guard
		if (typeof window === 'undefined' || !posthog) {
			return
		}

		posthog.config.capture_pageview = false

		// Record a pageview when route changes
		router.events.on('routeChangeComplete', onRouteChangeComplete)

		// Unassign event listener
		return () => {
			router.events.off('routeChangeComplete', onRouteChangeComplete)
		}
	}, [router.events])
}
