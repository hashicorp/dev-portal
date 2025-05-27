import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { Router } from 'next/router'
import useDatagrailPerformanceConsent from 'hooks/use-datagrail-performance-consent'

// Due to PostHog being a performance tool, we can only initialize if the user provides consent
// for performance cookies. Using the Datagrail event listeners, we check the user's consent
// preferences and only render the PostHog provider if they've consented to performance cookies.
export function ConditionalPostHogProvider({
	children,
}: {
	children: JSX.Element
}): JSX.Element {
	const categoryPerformanceConsent = useDatagrailPerformanceConsent()

	useEffect(() => {
		if (categoryPerformanceConsent) {
			// This initialization code came from the PostHog documentation
			// https://posthog.com/docs/libraries/next-js#router-specific-instructions
			posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
				api_host:
					process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
				// Enable debug mode in development
				loaded: (posthog) => {
					if (process.env.NODE_ENV === 'development') posthog.debug()
				},
			})

			const handleRouteChange = () => posthog?.capture('$pageview')

			Router.events.on('routeChangeComplete', handleRouteChange)

			return () => {
				Router.events.off('routeChangeComplete', handleRouteChange)
			}
		}
	}, [categoryPerformanceConsent])

	if (categoryPerformanceConsent) {
		return <PostHogProvider client={posthog}>{children}</PostHogProvider>
	} else {
		return children
	}
}
