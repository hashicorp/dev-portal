import classNames from 'classnames'
import { HeadingProps } from './types'
import clamp from 'lib/clamp'
import s from './heading.module.css'

const Heading: React.FC<HeadingProps> = ({
  slug,
  heading,
  level,
  size,
  ...rest
}) => {
  const id = slug
  const className = classNames(
    rest.className,
    s[`h${clamp(size || level, 0, 4)}`]
  )
  const passableProps = {
    ...rest,
    className,
    id,
  }

  console.log(rest)

  const HeadingElement = `h${level}` as React.ElementType
  return <HeadingElement {...passableProps} />
}

export type { HeadingProps }
export default Heading
