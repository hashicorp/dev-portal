/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { render, screen, fireEvent } from '@testing-library/react'
import VideoHooksTestComponent from '../helpers/video-hooks-test-component'

describe('use-seconds-watched', () => {
	it('should track the amount of time the video has been watched', async () => {
		// Mock Date.now(), since our seconds timer relies on it,
		// and we don't want to have to wait for real time to advance during tests
		const realDateNow = Date.now.bind(global.Date)
		let globalNowAdjust = 0
		const testDate = realDateNow()
		global.Date.now = vi.fn(() => testDate + globalNowAdjust)
		// Set up our test component
		const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
		const secondsWatchedCallback = vi.fn()
		render(
			<VideoHooksTestComponent
				url={url}
				duration={10}
				secondsWatchedCallback={secondsWatchedCallback}
			/>
		)
		// Initialize video & start playing
		// (in the real world this happens when the video loads, & use clicks play)
		fireEvent.click(screen.getByText('loadVideo'))
		fireEvent.click(screen.getByText('playVideo'))
		// Step the first second of the video forward
		// (in the real world this happens as the video plays, and
		// Date.now() would report one second later, which we simulate with a mock)
		globalNowAdjust += 1000
		fireEvent.click(screen.getByText('stepOneSecond'))
		// The above two events should trigger our first secondsWatchedCallback
		// event. We're now at 1 second watched.
		expect(secondsWatchedCallback).toHaveBeenCalledTimes(1)
		expect(secondsWatchedCallback).toBeCalledWith(url, 1)
		// Step forward two more seconds, collecting progress as we go
		for (let i = 0; i < 2; i++) {
			globalNowAdjust += 1000
			fireEvent.click(screen.getByText('stepOneSecond'))
		}
		// We should now be at 3 seconds watched
		expect(secondsWatchedCallback).toHaveBeenCalledTimes(3)
		expect(secondsWatchedCallback).toBeCalledWith(url, 3)
		// Step forward seven more seconds to finish the video
		for (let i = 0; i < 7; i++) {
			globalNowAdjust += 1000
			fireEvent.click(screen.getByText('stepOneSecond'))
		}
		// Looking at all the previous calls of secondsWatchedCallback,
		// we should see a call for each second of video played
		expect(secondsWatchedCallback.mock.calls).toEqual(
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s: number) => [url, s])
		)
		// When resetting the play head and watching over another second of video
		// in the same session, we should see another call for video played
		fireEvent.click(screen.getByText('restartVideo'))
		globalNowAdjust += 1000
		fireEvent.click(screen.getByText('stepOneSecond'))
		expect(secondsWatchedCallback).toBeCalledWith(url, 11)
		// Restore Date.now()
		global.Date.now = realDateNow
	})
})
