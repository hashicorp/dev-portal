/**
 * Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

// SSR-safe dynamic import
let posthog: typeof import('posthog-js').default | null = null
if (typeof window !== 'undefined') {
	import('posthog-js').then((module) => {
		posthog = module.default
	})
}

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
	if (posthog?.capture) {
		posthog.capture(eventName, properties)
	}
}

/**
 * Enables PostHog video start tracking
 */
export function trackVideoStart(url: string): void {
	if (!posthog) return

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
	if (!posthog) return

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

/**
 * Pushes a 'Nav link click' custom event to PostHog.
 * A wrapper around the PostHog custom event method.
 *
 * @param {string} name - The name of the nav link
 * @param {string} href - The href for the nav link
 * @param {string} [section] - The name of the section of the nav. Top-level links do not have a section.
 */
export const trackNavClickEvent = (
	name: string,
	href: string,
	section?: string,
) => {
	posthog.capture('Nav link click', {
		name,
		href,
		section,
	})
}
