/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { SANDBOX_EVENT } from 'lib/posthog-events'

/**
 * Dynamic import of PostHog to ensure SSR safety.
 * This is loaded lazily only in the browser.
 * This type of check is ok here since it's outside of the rendering logic
 */
let posthog: typeof import('posthog-js').default | null = null
if (typeof window !== 'undefined') {
	import('posthog-js').then((module) => {
		posthog = module.default
	})
}

// Before this was extracted, this function was causing circular dependency issues

/**
 * Track sandbox interaction events
 * @param interactionType - Type of interaction (e.g., 'click', 'open')
 * @param sandboxId - ID of the sandbox being interacted with
 * @param additionalProps - Additional properties to track
 */
export const trackSandboxInteraction = (
	interactionType: string,
	sandboxId: string,
	additionalProps: Record<string, unknown> = {}
) => {
	if (typeof window !== 'undefined' && posthog?.capture) {
		posthog.capture(SANDBOX_EVENT.SANDBOX_OPEN, {
			interaction_type: interactionType,
			sandbox_id: sandboxId,
			...additionalProps,
			timestamp: new Date().toISOString(),
			page_url: window.location.href,
		})
	}
}
