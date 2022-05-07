import { HeadingBlockProps } from './types'
import s from './heading-block.module.css'

function HeadingBlock({ heading, headingSlug }: HeadingBlockProps) {
  return (
    <h2 id={headingSlug} className={s.heading}>
      {heading}
    </h2>
  )
}

export type { HeadingBlockProps }
export { HeadingBlock }
