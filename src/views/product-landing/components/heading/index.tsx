import { HeadingProps } from './types'
import clamp from 'lib/clamp'
import s from './style.module.css'

function Heading({
  slug,
  heading,
  level,
  size,
}: HeadingProps): React.ReactElement {
  const Component = `h${level}` as React.ElementType
  return (
    <Component
      id={slug}
      data-style-as={size}
      className={s[`h${clamp(size || level, 0, 4)}`]}
    >
      {heading}
    </Component>
  )
}

export type { HeadingProps }
export default Heading
