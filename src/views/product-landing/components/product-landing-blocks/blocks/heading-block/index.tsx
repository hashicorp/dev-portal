import { HeadingBlockProps } from './types'
import s from './heading-block.module.css'

function HeadingBlock({ heading, headingSlug }: HeadingBlockProps) {
  return (
    <pre className={s.placeholder}>
      <code>
        <h2 id={headingSlug} className={s.heading}>
          {heading} [id={headingSlug}]
        </h2>
      </code>
    </pre>
  )
}

export type { HeadingBlockProps }
export { HeadingBlock }
