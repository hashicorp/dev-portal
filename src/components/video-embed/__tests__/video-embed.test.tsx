/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

/**
 * @TODO rewrite this to be an integration test. This test causes segmentation
 * faults both locally and in PR checks.
 *
 * https://app.asana.com/0/1202097197789424/1202765914032430/f
 */

// it('should render a root element with a `playerWrapper` class', () => {
// 	const { container } = render(
// 		<VideoEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
// 	)
// 	expect(container.firstChild).toHaveClass('playerWrapper')
// })

// Analytics via Segment
// https://github.com/hashicorp/dev-portal/blob/main/analytics/spec/events/video_played.yaml
it.todo('should track a 1% "Video Played" event')
it.todo('should track a 25% "Video Played" event')
it.todo('should track a 50% "Video Played" event')
it.todo('should track a 75% "Video Played" event')
it.todo('should track a 90% "Video Played" event')
