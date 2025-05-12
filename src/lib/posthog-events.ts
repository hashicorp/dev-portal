/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
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
