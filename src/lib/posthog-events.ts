/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Enables PostHog video start tracking
 */
export function trackVideoStart(url: string) {
	if (!window?.posthog) return

	const video_host = url.includes('wistia')
		? 'wistia'
		: url.includes('youtube')
		? 'youtube'
		: 'other'

	window.posthog.capture('video_start', {
		video_host,
		url,
	})
}
