import { ReactElement } from 'react'
import s from './style.module.css'

function HomepageHero(): ReactElement {
  return (
    <div className={s.root}>
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
