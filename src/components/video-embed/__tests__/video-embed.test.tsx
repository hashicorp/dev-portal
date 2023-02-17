/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render } from '@testing-library/react'
import VideoEmbed from '../'

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

/**
 * TODO: I'm not sure how we can implement video analytics testing in Jest.
 * Jest doesn't seem to support video embeds in the way we might expect.
 * We may need to lean on integration tests in order to assert that video
 * analytics are working as expected.
 */

// Analytics via Heap (drop in favour of Segment?)
it.todo('should fire a Heap "Video Started" event when the video starts')
it.todo('should fire a Heap "Video Ended" event when the video ends')

// Analytics via Segment
// https://github.com/hashicorp/dev-portal/blob/main/analytics/spec/events/video_played.yaml
it.todo('should track a 1% "Video Played" event')
it.todo('should track a 25% "Video Played" event')
it.todo('should track a 50% "Video Played" event')
it.todo('should track a 75% "Video Played" event')
it.todo('should track a 90% "Video Played" event')
