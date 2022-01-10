import { HeadingProps } from './types'
import clamp from 'lib/clamp'
import s from './style.module.css'

function Heading({
  slug,
  heading,
  level,
  style_as,
}: HeadingProps): React.ReactElement {
  const Component = `h${level}` as React.ElementType
  return (
    <Component
      id={slug}
      data-style-as={style_as}
      className={s[`h${clamp(style_as || level, 0, 4)}`]}
    >
      {heading}
    </Component>
  )
}

export type { HeadingProps }
export default Heading
