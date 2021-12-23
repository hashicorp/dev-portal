import { ReactElement } from 'react'
import s from './style.module.css'

function HomepageHero(): ReactElement {
  return (
    <div className={s.root}>
      <div className={s.textPart}>
        <h1>Welcome to Dev Portal</h1>
        <p>
          This says something here about HashiCorp documentation and it&apos;s
          great.
        </p>
      </div>
      <div className={s.imagePart}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/images/ballmer.gif"
          alt="A sweaty and enthusiastic person named Steve Ballmer shouting Developers Developers Developers to a rapt audience"
        />
      </div>
    </div>
  )
}

export default HomepageHero
