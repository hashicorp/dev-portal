import { CSSProperties } from 'react'
import { HeroHeadingVisualProps } from './types'
import s from './hero-heading-visual.module.css'

function HeroHeadingVisual({
  heading,
  image,
  productSlug,
}: HeroHeadingVisualProps) {
  return (
    <div
      className={s.root}
      style={
        {
          '--gradient-start': `var(--token-color-${productSlug}-gradient-faint-start)`,
          '--gradient-stop': `var(--token-color-${productSlug}-gradient-faint-stop)`,
        } as CSSProperties
      }
    >
      <h1 className={s.heading}>{heading}</h1>
      <div className={s.image}>
        <img src={image} alt="" />
      </div>
    </div>
  )
}

export { HeroHeadingVisual }
export default HeroHeadingVisual
