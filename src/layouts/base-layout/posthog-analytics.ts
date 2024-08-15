import { useEffect } from 'react'
import { useRouter } from 'next/router'

declare global {
	interface Window {
		posthog?: $TSFixMe
	}
}

function onRouteChangeComplete() {
	if (window?.posthog?.capture === undefined) return
	window.posthog.capture('$pageview')
}

/**
 * Sets up PostHog analytics calls on route changes to track page view analytics.
 */
export default function usePostHogPageAnalytics(): void {
	const router = useRouter()

	useEffect(() => {
		// Ensures code only runs if PostHog has been initialized
		if (window?.posthog?.capture === undefined) return

		// Record a pageview when route changes
		router.events.on('routeChangeComplete', onRouteChangeComplete)

		// Unassign event listener
		return () => {
			router.events.off('routeChangeComplete', onRouteChangeComplete)
		}
	}, [router.events])
}
