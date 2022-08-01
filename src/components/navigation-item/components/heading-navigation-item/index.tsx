import { HeadingNavigationItemProps } from './types'
import s from './heading-navigation-item.module.css'

const HeadingNavigationItem = ({
  level = 2,
  text,
}: HeadingNavigationItemProps) => {
  const HeadingElement = `h${level}` as React.ElementType

  return <HeadingElement className={s.root}>{text}</HeadingElement>
}

export type { HeadingNavigationItemProps }
export default HeadingNavigationItem
