import type { HeroProps } from './hero'
import Hero from './hero'
import VideoEmbed from 'components/video-embed'
import s from './hero.module.css'

interface HeroWithVideoProps extends HeroProps {
  videoUrl: string
}

function HeroWithVideo({
  badgeText,
  heading,
  description,
  videoUrl,
}: HeroWithVideoProps) {
  return (
    <Hero
      className={s.withVideo}
      badgeText={badgeText}
      heading={heading}
      description={description}
    >
      <VideoEmbed url={videoUrl} />
    </Hero>
  )
}

export { HeroWithVideo }
