/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'

declare global {
	interface Window {
		posthog?: $TSFixMe
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
	if (window?.posthog?.capture === undefined) return
	window.posthog.capture('$pageview')
}

/**
 * Enables PostHog page view tracking on route changes
 */
export default function usePostHogPageAnalytics(): void {
	const router = useRouter()

	useEffect(() => {
		// Ensures code only runs if PostHog has been initialized
		if (!window?.posthog?.capture) return

		// Record a pageview when route changes
		router.events.on('routeChangeComplete', onRouteChangeComplete)

		// Unassign event listener
		return () => {
			router.events.off('routeChangeComplete', onRouteChangeComplete)
		}
	}, [router.events])
}
