import { HeadingProps } from './types'

function Heading({
  __heading_slug,
  heading,
  level,
}: HeadingProps): React.ReactElement {
  const Component = `h${level}` as React.ElementType
  return <Component id={__heading_slug}>{heading}</Component>
}

export type { HeadingProps }
export default Heading
