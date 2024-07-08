/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import VideoHooksTestComponent from '../helpers/video-hooks-test-component'

const PERCENT_MILESTONES = [1, 25, 50, 75, 90]

describe('use-segments-played', () => {
	it('should track the percentage of the video content that has been played', async () => {
		const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		const percentPlayedCallback = vi.fn()
		render(
			<VideoHooksTestComponent
				url={url}
				duration={10}
				percentPlayedCallback={percentPlayedCallback}
				percentPlayedMilestones={PERCENT_MILESTONES}
			/>
		)
		// Initialize video & start playing
		// (in the real world this happens when the video loads, & use clicks play)
		fireEvent.click(screen.getByText('loadVideo'))
		fireEvent.click(screen.getByText('playVideo'))
		// Step the first second of the video forward
		// (in the real world this happens as the video plays)
		fireEvent.click(screen.getByText('stepOneSecond'))
		// Collect the mid-play moment at the one-second mark
		// (in the real world this happens in react-player's onProgress callback)
		// fireEvent.click(screen.getByText('collectMoment'))
		// The above two events should trigger our first percentPlayedCallback
		// event. We're now at 10% completion, the closes milestone is of 1%
		expect(percentPlayedCallback).toHaveBeenCalledTimes(1)
		expect(percentPlayedCallback).toBeCalledWith(url, 1)
		// Step forward two more seconds, collecting progress as we go
		for (let i = 0; i < 2; i++) {
			fireEvent.click(screen.getByText('stepOneSecond'))
			// fireEvent.click(screen.getByText('collectMoment'))
		}
		// We should now be at 30%, so our 25% milestone should have fired
		expect(percentPlayedCallback).toHaveBeenCalledTimes(2)
		expect(percentPlayedCallback).toBeCalledWith(url, 25)
		// Step forward seven more seconds to finish the video
		for (let i = 0; i < 7; i++) {
			fireEvent.click(screen.getByText('stepOneSecond'))
			// fireEvent.click(screen.getByText('collectMoment'))
		}
		// Looking at all the previous calls of percentPlayedCallback,
		// all of our progress milestones should have been called, in order
		expect(percentPlayedCallback.mock.calls).toEqual(
			PERCENT_MILESTONES.map((p: number) => [url, p])
		)
		// When resetting the play head and watching over another second of video
		// in the same session, we should not see any new percentage calls
		fireEvent.click(screen.getByText('restartVideo'))
		fireEvent.click(screen.getByText('stepOneSecond'))
		// fireEvent.click(screen.getByText('collectMoment'))
		expect(percentPlayedCallback).toBeCalledTimes(PERCENT_MILESTONES.length)
	})
})
