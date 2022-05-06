import { HeroHeadingVisualProps } from './types'
import s from './hero-heading-visual.module.css'

function HeroHeadingVisual({
  heading,
  image,
  productSlug,
}: HeroHeadingVisualProps) {
  return (
    <>
      <pre className={s.placeholder}>
        <code>
          {JSON.stringify(
            { component: 'HeroHeadingVisual', heading, image, productSlug },
            null,
            2
          )}
        </code>
      </pre>
    </>
  )
}

export { HeroHeadingVisual }
export default HeroHeadingVisual
