import ReactPlayer from 'react-player'
import { VideoEmbedProps } from './types'
import s from './video-embed.module.css'

export default function VideoEmbed({
  start,
  ...reactPlayerProps
}: VideoEmbedProps) {
  function track(event: string) {
    window.heap?.track(event, {
      url: reactPlayerProps.url,
    })
  }

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
    <div className={s.playerWrapper}>
      <ReactPlayer
        config={config}
        {...reactPlayerProps}
        onStart={() => track('Video Started')}
        onEnded={() => track('Video Ended')}
        className={s.reactPlayer}
        width="100%"
        height="100%"
        controls
      />
    </div>
  )
}
