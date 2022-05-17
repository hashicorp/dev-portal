import { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { VideoEmbedProps } from './types'
import {
  trackHeapStarted,
  trackHeapEnded,
  usePlayState,
  useSegmentsPlayed,
  // useSecondsWatched,
  useMilestones,
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

function VideoEmbed({
  start,
  onWatchProgress = () => null,
  ...reactPlayerProps
}: VideoEmbedProps) {
  /**
   * We need our videoUrl to be a string for analytics purposes.
   * react-player supports other types, but we can't use them as easily.
   */
  const videoUrl = reactPlayerProps.url
  if (typeof videoUrl !== 'string') {
    throw new Error(
      `VideoEmbed URL must be a string. Found type "${typeof videoUrl}". While other formats for this prop may be supported by react-player, they are not supported by our VideoEmbed component. Please ensure the "url" prop is a string.`
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
  const [
    playState,
    { setEnded, setDuration, setPosition, setPlaying, setStopped },
  ] = usePlayState()
  // Note: not using secondsWatched for now, but it's ready for use.
  // const secondsWatched = useSecondsWatched(playState)
  const segmentsPlayed = useSegmentsPlayed(
    playState,
    PROGRESS_INTERVAL,
    MAX_PLAYBACK_SPEED
  )
  const videoPercentMilestone = useMilestones(
    segmentsPlayed.percent,
    PERCENT_MILESTONES
  )

  /**
   * When we reach a new percent watched milestone,
   * fire a callback to update on video progress.
   */
  useEffect(() => {
    if (videoPercentMilestone !== null) {
      onWatchProgress(videoUrl, videoPercentMilestone)
    }
  }, [videoUrl, videoPercentMilestone, onWatchProgress])

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
          onStart={() => trackHeapStarted(videoUrl)}
          progressInterval={PROGRESS_INTERVAL}
          onProgress={({ playedSeconds }: { playedSeconds: number }) => {
            setPosition(playedSeconds)
          }}
          onEnded={() => {
            setEnded()
            trackHeapEnded(videoUrl)
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
              segmentsPercent: segmentsPlayed.percent,
              duration: playState.duration,
              segmentsPlayed: segmentsPlayed.list,
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
 * TODO: add on proper analytics events.
 * Wrap VideoEmbed in a component that hooks into the incoming URL,
 * and also uses useRouter to get the rest of the data we need for the event.
 * Could also expose and pass in PERCENT_MILESTONES as a prop at that point.
 * ("analytics/spec/events/video_played.yml" for details)
 */
export default VideoEmbed

/*

CONTEXT still needs to be added.

path: document.location.pathname
referrer: document.referrer
search: document.location.search
url: document.location.href
title: document.title
userAgent: navigator.userAgent
locale: function getClientLocale() {
  try {
    return Intl.NumberFormat().resolvedOptions().locale;
  } catch (err) {
    if (window.navigator.languages) {
      return window.navigator.languages[0]
    } else {
      return window.navigator.userLanguage || window.navigator.language
    }
  }
}
DETAILS ON LOCALE:
Intl.NumberFormat().resolvedOptions().locale
(with caveats, must fallback, eg to window.navigator.languages[0],
  window.navigator.userLanguage, or window.navigator.language;
  see https://stackoverflow.com/a/42070353)

{
  context: {
    page: {
      path: "", //  Containing an initial '/' followed by the path of the URL
      referrer: "", // Contains an absolute or partial address of the page that makes the request
      search: "", // The URL parameters passed to the page
      title: "", // The document's title that is shown in a browser's title bar or a page's tab
      url: "", // The full URL of where the analytics request took place
    },
    userAgent: "", // A characteristic string that lets servers and network peers identify the application, operating system, vendor, and/or version of the requesting user agent.
    locale: "", // Locale is a set of language - or country-based preferences for a user interface.
  },
  properties: {
    video_url: "", // The URL of the video
    video_progress: 0, // The percent of video content that has been played
  }
}

*/
