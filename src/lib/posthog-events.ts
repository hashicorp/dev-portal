/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import posthog from 'posthog-js'

/**
 * Tracks sandbox events using PostHog
 */

export enum TERMINAL_EVENT {
	TERMINAL_OPEN = 'hosted_terminal_open',
	TERMINAL_CLOSED = 'hosted_terminal_closed',
}

export const trackTerminalEvent = (
	eventName: `${TERMINAL_EVENT}`,
	properties: {
		labId: string
		page: string
	}
): void => {
	if (window?.posthog?.capture) {
		window.posthog.capture(eventName, properties)
	}
}

/**
 * Enables PostHog video start tracking
 */
export function trackVideoStart(url: string): void {
	let video_host = ''
	if (url.includes('wistia')) {
		video_host = 'wistia'
	} else if (url.includes('youtube')) {
		video_host = 'youtube'
	}

	if (video_host) {
		posthog.capture('video_start', {
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
	let video_host = ''
	if (url.includes('wistia')) {
		video_host = 'wistia'
	} else if (url.includes('youtube')) {
		video_host = 'youtube'
	}

	if (video_host) {
		posthog.capture('video_play', {
			video_host,
			url,
		})
	}
}
