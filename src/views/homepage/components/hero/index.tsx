import { ReactElement } from 'react'
import Badge from 'components/badge'
import Heading from 'components/heading'
import s from './hero.module.css'

interface HeroProps {
  heading: string
  description: ReactElement
}

export default function Hero({ heading, description }: HeroProps) {
  return (
    <header className={s.hero}>
      <div className={s.container}>
        <div className={s.content}>
          <Badge text="Beta" color="highlight" type="outlined" />
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
