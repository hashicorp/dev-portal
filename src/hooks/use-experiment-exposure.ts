import { useEffect } from 'react'
import posthog from 'posthog-js'
import { useExperiments } from 'contexts/experiments'

/**
 * Reports feature flag evaluation to PostHog so the experiment
 * has visibility into which variant a session was assigned.
 * Should be called once at a high level in the tree (e.g. BaseLayout),
 * not in every component that reads the flag.
 *
 * @param flagKey - The PostHog feature flag key to report
 */
export function useExperimentExposure(flagKey: string): void {
	const { flags } = useExperiments()
	const variant = flags[flagKey]

	useEffect(() => {
		if (variant === undefined) return
        
		const capture = () => {
			posthog.capture('$feature_flag_called', {
				$feature_flag: flagKey,
				$feature_flag_response: variant,
			})
		}

		// PostHog may not be initialized yet on the first page a user visits
		// (e.g. home page) because ConditionalPostHogProvider's init effect
		// runs after child effects. onFeatureFlags fires once flags are ready,
		// or immediately if PostHog is already loaded.
		if (posthog.__loaded) {
			capture()
		} else {
			return posthog.onFeatureFlags(capture)
		}
        
		// Intentionally only fires once on mount — variant won't change mid-session
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
