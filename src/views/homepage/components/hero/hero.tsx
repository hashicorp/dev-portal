import { ReactElement } from 'react'
import classNames from 'classnames'
import Badge from 'components/badge'
import Heading from 'components/heading'
import s from './hero.module.css'

export interface HeroProps {
  className?: string
  badgeText?: string
  heading: string
  description: ReactElement
}

export default function Hero({
  className,
  badgeText,
  heading,
  description,
  children,
}: HeroProps & {
  children: ReactElement
}) {
  return (
    <header className={classNames(s.hero, className)}>
      <div className={s.container}>
        <div className={s.primary}>
          {badgeText ? (
            <Badge text={badgeText} color="highlight" className={s.badge} />
          ) : null}
          <Heading
            className={s.title}
            level={1}
            size={500}
            slug="welcome-to-dev-portal"
            weight="bold"
          >
            {heading}
          </Heading>
          <div className={s.description}>{description}</div>
        </div>

        <div className={s.secondary}>{children}</div>
      </div>
    </header>
  )
}
