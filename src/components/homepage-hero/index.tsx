import { ReactElement } from 'react'
import classNames from 'classnames'
import Heading from 'components/heading'
import Text from 'components/text'
import s from './homepage-hero.module.css'

function HomepageHero({ className }: { className?: string }): ReactElement {
  return (
    <div className={classNames(s.root, className)}>
      <div className={s.textSection}>
        <Heading
          className={s.heading}
          level={1}
          size={500}
          slug="welcome-to-dev-portal"
          weight="bold"
        >
          Welcome to Dev Portal
        </Heading>
        <Text className={s.subheading}>
          This says something here about HashiCorp documentation and it&apos;s
          great.
        </Text>
      </div>
      <div className={s.imageSection}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={1316}
          height={640}
          src={require('./img/hero-visual.png')}
          alt=""
        />
      </div>
    </div>
  )
}

export default HomepageHero
