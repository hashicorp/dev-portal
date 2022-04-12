import { ReactElement } from 'react'
import Badge from 'components/badge'
import Heading from 'components/heading'
import s from './hero.module.css'

interface HeroProps {
  badgeText?: string
  heading: string
  description: ReactElement
}

export default function Hero({ badgeText, heading, description }: HeroProps) {
  return (
    <header className={s.hero}>
      <div className={s.container}>
        <div className={s.content}>
          {badgeText ? (
            <Badge text={badgeText} color="highlight" type="outlined" />
          ) : null}
          <Heading
            className={s.title}
            level={1}
            size={500}
            weight="bold"
            slug="testing"
          >
            {heading}
          </Heading>
          <div className={s.description}>{description}</div>
        </div>
      </div>
    </header>
  )
}
