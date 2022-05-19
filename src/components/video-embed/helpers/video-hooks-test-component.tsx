import { useEffect } from 'react'
import {
  usePlayState,
  useMilestones,
  useSecondsWatched,
  useSegmentsPlayed,
} from '.'

const PROGRESS_INTERVAL = 1000
const MAX_PLAYBACK_SPEED = 2.0

/**
 * This component is for testing purposes only.
 *
 * We can't do much testing on the video embeds themselves, as Jest does
 * not support video playback.
 *
 * But we can trust that react-player will fire specific callbacks that our
 * video embed hooks use to function. This isn't ideal, but we can construct
 * a test component that manually fires the events we expect from react-player,
 * in order to assert that our hooks and related callbacks are working.
 */
export default function VideoHooksTest({
  url,
  duration,
  percentPlayedCallback,
  percentPlayedMilestones = [],
  secondsWatchedCallback,
}: {
  url: string
  duration: number
  percentPlayedCallback?: (url: string, percentPlayed: number) => void
  percentPlayedMilestones?: number[]
  secondsWatchedCallback?: (url: string, secondsWatched: number) => void
}) {
  const [playState, { setDuration, setPosition, setPlaying, setStopped }] =
    usePlayState()
  const secondsWatched = useSecondsWatched(playState)
  const segmentsPlayed = useSegmentsPlayed(
    playState,
    PROGRESS_INTERVAL,
    MAX_PLAYBACK_SPEED
  )
  const videoPercentMilestone = useMilestones(
    segmentsPlayed.percent,
    percentPlayedMilestones
  )

  /**
   * When we reach a new percent watched milestone,
   * fire a callback to update on video percent played.
   */
  useEffect(() => {
    const hasCallback = typeof percentPlayedCallback == 'function'
    if (hasCallback && videoPercentMilestone !== null) {
      percentPlayedCallback(url, videoPercentMilestone)
    }
  }, [url, videoPercentMilestone, percentPlayedCallback])

  /**
   * When we reach a new number of seconds watched,
   * fire a callback to update on video seconds watched.
   */
  useEffect(() => {
    const hasCallback = typeof secondsWatchedCallback == 'function'
    if (hasCallback && secondsWatched > 0) {
      secondsWatchedCallback(url, secondsWatched)
    }
  }, [url, secondsWatched, secondsWatchedCallback])

  return (
    <div>
      <button onClick={() => setDuration(duration)}>loadVideo</button>
      <button onClick={setPlaying}>playVideo</button>
      <button onClick={setStopped}>pauseVideo</button>
      <button onClick={() => setPosition(0)}>restartVideo</button>
      <button onClick={() => setPosition(playState.position + 1)}>
        stepOneSecond
      </button>
    </div>
  )
}
