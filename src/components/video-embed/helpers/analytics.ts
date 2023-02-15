/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { safeAnalyticsTrack } from 'lib/analytics'

/**
 * video_played event
 *
 * Spec: "analytics/spec/events/video_played.yml"
 */
function videoPlayedEvent({
	video_url,
	video_progress,
}: {
	video_url: string
	video_progress: number
}) {
	safeAnalyticsTrack('Video Played', {
		video_url,
		video_progress,
	})
}

export { videoPlayedEvent }
