/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * Enables PostHog video start tracking
 */
export function trackVideoStart(video_id: string) {
	if (!window?.posthog) return
	window.posthog.capture('video_start', { video_id })
}
