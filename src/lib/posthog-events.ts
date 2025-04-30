/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Tracks sandbox events using PostHog
 */

export enum SANDBOX_EVENT {
	SANDBOX_STARTED = 'sandbox_started',
	SANDBOX_OPEN = 'sandbox_open',
	SANDBOX_CLOSED = 'sandbox_closed',
}

export const trackSandboxEvent = (
	eventName: `${SANDBOX_EVENT}`,
	properties: {
		labId: string
		page: string
	}
): void => {
	if (window?.posthog?.capture) {
		window.posthog.capture(eventName, properties)
}


 * Enables PostHog video start tracking
 */
export function trackVideoStart(url: string): void {
	if (!window?.posthog) return

	let video_host = ""
	if (url.includes('wistia')) {
		video_host = 'wistia'
	} else if (url.includes('youtube')) {
		video_host = 'youtube'
	} 

	if (video_host) {
		window.posthog.capture('video_start', {
			video_host,
			url,
		})
	}
}
