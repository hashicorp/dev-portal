import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { VideoEmbedProps } from './types'
import { useWatchEvents } from './helpers/start-stop-event-utils'
import { addPlayedTimeToSegments } from './helpers/collapse-played-times'
import s from './video-embed.module.css'

function trackRealProgress(
  duration: number,
  millisecondsPlayed: number,
  onWatchProgress: VideoEmbedProps['onWatchProgress']
) {
  if (!duration) {
    return null
  }
  // console.log({ millisecondsPlayed, duration })
  const secondsPlayed = millisecondsPlayed / 1000
  // const rawPercent = secondsPlayed / duration
  onWatchProgress(parseFloat(secondsPlayed.toFixed(2)))
}

//
//
//

export default function VideoEmbed({
  start,
  onWatchProgress = () => null,
  onWatchProgressSimple = () => null,
  ...reactPlayerProps
}: VideoEmbedProps) {
  const video_url = String(reactPlayerProps.url)

  // TODO: move segments stuff into separate hook
  const [segmentsPlayed, setSegmentsPlayed] = useState<[number, number][]>([])
  function collectMomentPlayed(playedTime: number) {
    setSegmentsPlayed(addPlayedTimeToSegments(playedTime, segmentsPlayed))
  }

  const [playerData, setPlayerData] = useState<{
    played: number
    playedSeconds: number
  }>({ played: 0, playedSeconds: 0 })
  const [duration, setDuration] = useState<number>()
  const {
    isPlaying,
    startPlayTimer,
    stopPlayTimer,
    recalculateTimeSpentWatching,
    secondsSpentWatching,
  } = useWatchEvents()

  // TODO: do we drop heap tracking in dev-dot considering we've
  // got a unified analytics plan around Segment?
  function trackHeap(event: string) {
    window.heap?.track(event, {
      url: reactPlayerProps.url,
    })
  }

  // TODO: with percentage in place from segmentsPercent hook (once that's done)
  // still need to useEffect from that percentage; when it hits our desired
  // levels (1, 25, 50, 75, 90); THEN we record actual events.
  useEffect(() => {
    trackRealProgress(duration, secondsSpentWatching, onWatchProgress)
  }, [video_url, duration, secondsSpentWatching, onWatchProgress])

  // TODO: move this segment logic to a hook
  const segmentSecondsPlayed = segmentsPlayed.reduce(
    (totalSeconds, segment) => {
      return totalSeconds + (segment[1] - segment[0])
    },
    0
  )
  const segmentsPercent =
    Math.round((segmentSecondsPlayed / duration) * 1000) / 10

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
          onDuration={(d: number) => setDuration(d)}
          onStart={() => trackHeap('Video Started')}
          onProgress={({ played, playedSeconds }) => {
            if (isPlaying) {
              collectMomentPlayed(playedSeconds)
            }
            setPlayerData({ played, playedSeconds })
            onWatchProgressSimple(parseFloat(playedSeconds.toFixed(2)))
            recalculateTimeSpentWatching()
          }}
          onBuffer={stopPlayTimer}
          onEnded={() => {
            trackHeap('Video Ended')
            if (isPlaying && duration) {
              collectMomentPlayed(duration)
            }
            stopPlayTimer()
            // TODO: combine collectMomentPlayed & stopPlayTimer into one hook
            // (likely still make sense as separate fns, though!)
          }}
          onPlay={startPlayTimer}
          onPause={stopPlayTimer}
          className={s.reactPlayer}
          width="100%"
          height="100%"
          controls
        />
      </div>
      {duration ? (
        <div className={s.playedTimes}>
          {segmentsPlayed.map((segment: [number, number]) => {
            return (
              <span
                key={segment.join('-')}
                style={{
                  top: 0,
                  left: `${(segment[0] / duration) * 100}%`,
                  width: `${((segment[1] - segment[0]) / duration) * 100}%`,
                }}
              />
            )
          })}
          <span
            style={{
              top: 0,
              left: `${(playerData.playedSeconds / duration) * 100}%`,
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
                playerData,
              },
              approachTwo: {
                isPlaying,
                secondsSpentWatching,
                duration,
                timeSpentPercent:
                  Math.round((secondsSpentWatching / duration) * 1000) / 10,
              },
              approachThree: {
                segmentsPercent,
                segmentsPlayed,
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
