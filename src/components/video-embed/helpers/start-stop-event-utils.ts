import { useEffect, useState } from 'react'

export interface StartStopEvent {
  type: 'start' | 'stop'
  eventTime: number
}

export function startStopEventsToSecondsPlayed(watchEvents: StartStopEvent[]) {
  let millisecondsPlayed = 0
  let lastPlayTimestamp: number | undefined
  for (let n = 0; n < watchEvents.length; n++) {
    const { type, eventTime } = watchEvents[n]
    if (type === 'stop' && typeof lastPlayTimestamp == 'number') {
      millisecondsPlayed += eventTime - lastPlayTimestamp
      lastPlayTimestamp = undefined
    } else if (type === 'start') {
      lastPlayTimestamp = eventTime
    }
  }
  if (typeof lastPlayTimestamp == 'number') {
    millisecondsPlayed += Date.now() - lastPlayTimestamp
  }
  const secondsPlayed = millisecondsPlayed / 1000
  return secondsPlayed
}

export function useWatchEvents() {
  const [startStopEvents, setStartStopEvents] = useState<
    { type: 'start' | 'stop'; eventTime: number }[]
  >([])
  const [secondsSpentWatching, setSecondsSpentWatching] = useState<number>(0)
  const [calculationTrigger, setCalculationTrigger] = useState<number>()

  function recalculateTimeSpentWatching() {
    setCalculationTrigger(Date.now())
  }

  function startPlayTimer() {
    setStartStopEvents(
      startStopEvents.concat({ type: 'start', eventTime: Date.now() })
    )
  }

  function stopPlayTimer() {
    setStartStopEvents(
      startStopEvents.concat({ type: 'stop', eventTime: Date.now() })
    )
  }

  useEffect(() => {
    setSecondsSpentWatching(startStopEventsToSecondsPlayed(startStopEvents))
  }, [startStopEvents, calculationTrigger])

  return {
    isPlaying:
      startStopEvents.length > 0 &&
      startStopEvents[startStopEvents.length - 1].type == 'start',
    startPlayTimer,
    stopPlayTimer,
    recalculateTimeSpentWatching,
    secondsSpentWatching,
  }
}
