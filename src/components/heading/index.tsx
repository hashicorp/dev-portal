import classNames from 'classnames'
import { HeadingProps } from './types'

const Heading: React.FC<HeadingProps> = ({
  level,
  size,
  slug,
  weight,
  ...rest
}) => {
  const id = slug
  const className = classNames(
    `hds-typography-display-${size}`,
    `hds-font-weight-${weight}`,
    rest.className
  )
  const passableProps = {
    ...rest,
    className,
    id,
  }

  const HeadingElement = `h${level}` as React.ElementType
  return <HeadingElement {...passableProps} />
}

export type { HeadingProps }
export default Heading
