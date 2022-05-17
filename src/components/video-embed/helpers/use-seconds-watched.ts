import { useEffect, useState } from 'react'
import { PlayState, StartStopEvent } from '../types'

export function useSecondsWatched(playState: PlayState): number {
  const [startStopEvents, setStartStopEvents] = useState<StartStopEvent[]>([])
  const [secondsWatched, setSecondsSpentWatching] = useState<number>(0)

  /**
   * TODO: do we really need an array of events?
   * Seems like no. Seems like we might only need lastPlayStart or something?
   */
  // When the isPlaying state changes, push a new start-stop event
  useEffect(() => {
    setStartStopEvents((prev: StartStopEvent[]) =>
      prev.concat({
        type: playState.isPlaying ? 'start' : 'stop',
        timestamp: Date.now(),
      })
    )
  }, [playState.isPlaying])

  // When start-stop events are updated, or the playState position changes,
  // re-calculate the seconds spent watching the video from start-stop events
  useEffect(() => {
    const newSecondsWatched = startStopEventsToSecondsWatched(startStopEvents)
    setSecondsSpentWatching(newSecondsWatched)
  }, [startStopEvents, playState.position])

  return Math.round(secondsWatched)
}

function startStopEventsToSecondsWatched(watchEvents: StartStopEvent[]) {
  let millisecondsWatched = 0
  let lastPlayTimestamp: number | undefined
  for (let n = 0; n < watchEvents.length; n++) {
    const { type, timestamp } = watchEvents[n]
    if (type === 'stop' && typeof lastPlayTimestamp == 'number') {
      millisecondsWatched += timestamp - lastPlayTimestamp
      lastPlayTimestamp = undefined
    } else if (type === 'start') {
      lastPlayTimestamp = timestamp
    }
  }
  if (typeof lastPlayTimestamp == 'number') {
    millisecondsWatched += Date.now() - lastPlayTimestamp
  }
  const secondsWatched = millisecondsWatched / 1000
  return secondsWatched
}
