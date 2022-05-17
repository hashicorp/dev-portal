import { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { VideoEmbedProps } from './types'
import {
  trackHeapStarted,
  trackHeapEnded,
  usePlayState,
  useSegmentsPlayed,
  useSecondsPlayed,
  usePercentMilestones,
} from './helpers'
import s from './video-embed.module.css'

/**
 * PERCENT_MILESTONES is specified in "analytics/spec/events/video_played.yml".
 * MAX_PLAYBACK_SPEED is based on max speeds for YouTube & Wistia.
 * PROGRESS_INTERVAL is react-player's default value, articulated for clarity
 *   in its purpose in the useSegmentsPlayed hook.
 */
const PERCENT_MILESTONES = [1, 25, 50, 75, 90]
const PROGRESS_INTERVAL = 1000
const MAX_PLAYBACK_SPEED = 2.0

export default function VideoEmbed({
  start,
  onWatchProgress = () => null,
  ...reactPlayerProps
}: VideoEmbedProps) {
  /**
   * We need our video_url to be a string for analytics purposes.
   * react-player supports other types, but we can't use them as easily.
   */
  const video_url = reactPlayerProps.url
  if (typeof video_url !== 'string') {
    throw new Error(
      `VideoEmbed URL must be a string. Found type "${typeof video_url}". While other formats for this prop may be supported by react-player, they are not supported by our VideoEmbed component. Please ensure the "url" prop is a string.`
    )
  }

  /**
   * Playback tracking is for analytics purposes.
   *
   * TODO: should only track (and only do calc maybe?) if user has opted in.
   * TODO: is the above handled at the window.analytics level?
   * TODO: regardless, make separate analytics.ts, rather than allowing
   * TODO: onWatchProgress to be passed in.
   */
  const [playState, { setDuration, setPosition, setPlaying, setStopped }] =
    usePlayState()
  const secondsPlayed = useSecondsPlayed(playState)
  const segmentsPlayed = useSegmentsPlayed(
    playState,
    PROGRESS_INTERVAL,
    MAX_PLAYBACK_SPEED
  )
  const percentMilestoneReached = usePercentMilestones(
    segmentsPlayed.percent,
    PERCENT_MILESTONES
  )

  /**
   * When we reach a new percent watched milestone,
   * fire an analytics event to update on video progress.
   */
  useEffect(() => {
    const video_progress = percentMilestoneReached
    // TODO: fire analytics event here, not function passed as prop
    onWatchProgress(video_url, video_progress)
  }, [video_url, percentMilestoneReached, onWatchProgress])

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
          config={config}
          {...reactPlayerProps}
          onDuration={setDuration}
          onStart={() => trackHeapStarted(video_url)}
          progressInterval={PROGRESS_INTERVAL}
          onProgress={({ playedSeconds }: { playedSeconds: number }) => {
            setPosition(playedSeconds)
            if (playState.isPlaying) {
              segmentsPlayed.collectMoment(playedSeconds)
            }
            secondsPlayed.recalculate()
          }}
          onEnded={() => {
            /**
             * onProgress timing varies; but it is unlikely to coincide exactly
             * with the end of the video, so we collectMoment for the video end,
             * to ensure % progress right up to the end of the video is tracked.
             */
            if (playState.isPlaying && playState.duration) {
              segmentsPlayed.collectMoment(playState.duration)
            }
            trackHeapEnded(video_url)
            setStopped()
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
                secondsPlayed: secondsPlayed.total,
                duration: playState.duration,
                timeSpentPercent:
                  Math.round(
                    (secondsPlayed.total / playState.duration) * 1000
                  ) / 10,
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
