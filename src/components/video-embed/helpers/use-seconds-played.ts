import { useEffect, useState } from 'react'
import { PlayState, StartStopEvent } from '../types'

export function useSecondsPlayed(playState: PlayState): {
  total: number
  recalculate: () => void
} {
  const [startStopEvents, setStartStopEvents] = useState<StartStopEvent[]>([])
  const [secondsWatched, setSecondsSpentWatching] = useState<number>(0)
  const [calculationTrigger, setCalculationTrigger] = useState<number>()

  function recalculateSecondsWatched() {
    setCalculationTrigger(Date.now())
  }

  // TODO: do we really need an array of events?
  // Seems like no. Seems like we might only need lastPlayStart or something?
  //
  // When the isPlaying state changes, push a new start-stop event
  useEffect(() => {
    setStartStopEvents((prev: StartStopEvent[]) =>
      prev.concat({
        type: playState.isPlaying ? 'start' : 'stop',
        timestamp: Date.now(),
      })
    )
  }, [playState.isPlaying])

  // When start-stop events are updated,
  // or when calculation is manually triggered,
  // re-calculate the seconds spent watching the video from start-stop events
  useEffect(() => {
    setSecondsSpentWatching(startStopEventsToSecondsPlayed(startStopEvents))
  }, [startStopEvents, calculationTrigger])

  return { total: secondsWatched, recalculate: recalculateSecondsWatched }
}

function startStopEventsToSecondsPlayed(watchEvents: StartStopEvent[]) {
  let millisecondsPlayed = 0
  let lastPlayTimestamp: number | undefined
  for (let n = 0; n < watchEvents.length; n++) {
    const { type, timestamp } = watchEvents[n]
    if (type === 'stop' && typeof lastPlayTimestamp == 'number') {
      millisecondsPlayed += timestamp - lastPlayTimestamp
      lastPlayTimestamp = undefined
    } else if (type === 'start') {
      lastPlayTimestamp = timestamp
    }
  }
  if (typeof lastPlayTimestamp == 'number') {
    millisecondsPlayed += Date.now() - lastPlayTimestamp
  }
  const secondsPlayed = millisecondsPlayed / 1000
  return secondsPlayed
}
