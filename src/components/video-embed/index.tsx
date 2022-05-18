import { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { VideoEmbedProps, VideoEmbedInnerProps } from './types'
import {
  trackHeapStarted,
  trackHeapEnded,
  usePlayState,
  useSegmentsPlayed,
  useSecondsWatched, // Not used... yet!
  videoPlayedEvent,
  useMilestones,
} from './helpers'
import s from './video-embed.module.css'

/**
 * MAX_PLAYBACK_SPEED is based on max speeds for YouTube & Wistia.
 * PROGRESS_INTERVAL is react-player's default value, declared again to make
 *   its role in the useSegmentsPlayed hook more clear.
 */
const PROGRESS_INTERVAL = 1000
const MAX_PLAYBACK_SPEED = 2.0

function VideoEmbed({
  start,
  url,
  percentPlayedCallback = () => null,
  percentPlayedMilestones,
  ...reactPlayerProps
}: VideoEmbedInnerProps) {
  /**
   * Playback tracking is for analytics purposes.
   */
  const [
    playState,
    { setEnded, setDuration, setPosition, setPlaying, setStopped },
  ] = usePlayState()
  // Note: not using secondsWatched for now, but it's ready for use.
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
   * fire a callback to update on video progress.
   */
  useEffect(() => {
    if (videoPercentMilestone !== null) {
      percentPlayedCallback(videoPercentMilestone)
    }
  }, [videoPercentMilestone, percentPlayedCallback])

  //  propagating aliased `start` prop down to the actual player config
  const config = start
    ? {
        youtube: {
          playerVars: {
            start,
          },
        },
        wistia: {
          options: { time: start },
        },
      }
    : {}

  return (
    <>
      <div className={s.playerWrapper}>
        <ReactPlayer
          {...reactPlayerProps}
          config={config}
          url={url}
          onDuration={setDuration}
          onStart={() => trackHeapStarted(url)}
          progressInterval={PROGRESS_INTERVAL}
          onProgress={({ playedSeconds }: { playedSeconds: number }) => {
            setPosition(playedSeconds)
          }}
          onEnded={() => {
            setEnded()
            trackHeapEnded(url)
          }}
          onPlay={setPlaying}
          onPause={setStopped}
          className={s.reactPlayer}
          width="100%"
          height="100%"
          controls
        />
      </div>
      {/* TODO: remove below, for dev purposes only */}
      {playState.duration ? (
        <div className={s.playedTimes}>
          {segmentsPlayed.list.map((segment: [number, number]) => {
            return (
              <span
                key={segment.join('-')}
                style={{
                  top: 0,
                  left: `${(segment[0] / playState.duration) * 100}%`,
                  width: `${
                    ((segment[1] - segment[0]) / playState.duration) * 100
                  }%`,
                }}
              />
            )
          })}
          <span
            style={{
              top: '-4px',
              bottom: '-4px',
              height: 'auto',
              left: `${(playState.position / playState.duration) * 100}%`,
              width: '1px',
              background: 'magenta',
            }}
          />
        </div>
      ) : null}
      <pre>
        <code>
          {JSON.stringify(
            {
              approachOne: {
                playState,
              },
              approachTwo: {
                isPlaying: playState.isPlaying,
                secondsWatched: secondsWatched,
                duration: playState.duration,
                timeSpentPercent:
                  Math.round((secondsWatched / playState.duration) * 1000) / 10,
              },
              approachThree: {
                segmentsPercent: segmentsPlayed.percent,
                segmentsPlayed: segmentsPlayed.list,
              },
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  )
}

/**
 * Wraps VideoEmbed with analytics, using the percentPlayedCallback.
 * PERCENT_MILESTONES is specified in "analytics/spec/events/video_played.yml".
 */
const PERCENT_MILESTONES = [1, 25, 50, 75, 90]
function VideoEmbedWithAnalytics({ url, ...restProps }: VideoEmbedProps) {
  /**
   * We need our videoUrl to be a string for analytics purposes.
   * react-player supports other types, but we can't use them as easily.
   */
  if (typeof url !== 'string') {
    throw new Error(
      `VideoEmbed URL must be a string. Found type "${typeof url}". While other formats for this prop may be supported by react-player, they are not supported by our VideoEmbed component. Please ensure the "url" prop is a string.`
    )
  }

  return (
    <VideoEmbed
      {...restProps}
      url={url}
      percentPlayedMilestones={PERCENT_MILESTONES}
      percentPlayedCallback={(percentPlayed: number) => {
        videoPlayedEvent({ video_url: url, video_progress: percentPlayed })
      }}
    />
  )
}

// Export the component with analytics
export default VideoEmbedWithAnalytics
