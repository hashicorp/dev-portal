import { HeadingProps } from './types'
import s from './style.module.css'

function Heading({
  __heading_slug,
  heading,
  level,
}: HeadingProps): React.ReactElement {
  const Component = `h${level}` as React.ElementType
  return (
    <Component id={__heading_slug} className={s[`h${level}`]}>
      {heading}
    </Component>
  )
}

export type { HeadingProps }
export default Heading
