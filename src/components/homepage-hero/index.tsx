import { ReactElement } from 'react'
import s from './style.module.css'
import classNames from 'classnames'

function HomepageHero({ className }: { className?: string }): ReactElement {
  return (
    <div className={classNames(s.root, className)}>
      <div className={s.textSection}>
        <h1 className={s.heading}>Welcome to Dev Portal</h1>
        <p className={s.subheading}>
          This says something here about HashiCorp documentation and it&apos;s
          great.
        </p>
      </div>
      <div className={s.imageSection}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={require('./img/hero-visual.png')} alt="" />
      </div>
    </div>
  )
}

export default HomepageHero
