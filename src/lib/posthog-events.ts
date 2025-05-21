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

/**
 * Enables PostHog video play tracking
 * This is different from the video start event because it is triggered
 * when the user actually plays the video (start and after play after pause).
 */
export function trackVideoPlay(url: string): void {
	if (!window?.posthog) return

	let video_host = ""
	if (url.includes('wistia')) {
		video_host = 'wistia'
	} else if (url.includes('youtube')) {
		video_host = 'youtube'
	} 

	if (video_host) {
		window.posthog.capture('video_play', {
			video_host,
			url,
		})
	}
}
