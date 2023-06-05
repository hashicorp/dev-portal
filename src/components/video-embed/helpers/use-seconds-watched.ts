/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useEffect, useState } from 'react'
import { PlayState } from '../types'

interface SecondsWatchedState {
	millisWatched: number
	lastPlayStartTimestamp: number | null
}

export function useSecondsWatched(playState: PlayState): number {
	const [state, setState] = useState<SecondsWatchedState>({
		millisWatched: 0,
		lastPlayStartTimestamp: null,
	})

	/**
	 * When the playState "isPlaying" or "position" changes,
	 * re-calculate the seconds spent watching the video based on play status,
	 * and update the lastPlayStartTimestamp
	 */
	useEffect(() => {
		setState((prev: SecondsWatchedState) => {
			/**
			 * If the video was playing on the last update,
			 * figure out how many milliseconds we've watched since then.
			 */
			const moreMillisWatched =
				typeof prev.lastPlayStartTimestamp == 'number'
					? Date.now() - prev.lastPlayStartTimestamp
					: 0
			return {
				/**
				 * If the video is currently playing, set the playStartTimestamp so
				 * we can add more watched time on the next update. Otherwise, the
				 * video is paused, so we should not add time on the next update.
				 */
				lastPlayStartTimestamp: playState.isPlaying ? Date.now() : null,
				millisWatched: prev.millisWatched + moreMillisWatched,
			}
		})
	}, [playState.isPlaying, playState.position])

	/**
	 * Round to seconds before returning, makes testing much easier
	 * at the cost of a tiny bit of precision
	 */
	return Math.round(state.millisWatched / 1000)
}
