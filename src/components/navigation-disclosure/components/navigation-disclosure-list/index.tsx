import classNames from 'classnames'
import { NavigationDisclosureListProps } from './types'
import s from './navigation-disclosure-list.module.css'

/**
 * Component for rendering the `<ul>` element within the content of a
 * `NavigationDisclosure`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureList = ({
  children,
  className,
}: NavigationDisclosureListProps) => {
  return <ul className={classNames(s.root, className)}>{children}</ul>
}

export type { NavigationDisclosureListProps }
export default NavigationDisclosureList
