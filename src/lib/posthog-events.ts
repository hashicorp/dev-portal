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
	SANDBOX_LOADED = 'sandbox_loaded',
	SANDBOX_ERROR = 'sandbox_error',
	SANDBOX_RETRY = 'sandbox_retry',
}

export const trackSandboxEvent = (
	eventName: `${SANDBOX_EVENT}`,
	properties: {
		labId: string
		page?: string
		error?: string
		retryCount?: number
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
	if (!window?.posthog) return

	let video_host = ''
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

	let video_host = ''
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
}
