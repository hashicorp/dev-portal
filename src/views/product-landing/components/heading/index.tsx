import { HeadingProps } from './types'
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
      className={s[`h${typeof style_as == 'number' ? style_as : level}`]}
    >
      {heading}
    </Component>
  )
}

export type { HeadingProps }
export default Heading
