import posthog from 'posthog-js'
import { SANDBOX_EVENT } from 'lib/posthog-events'

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
