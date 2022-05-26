import classNames from 'classnames'
import { NavigationDisclosureListItemProps } from './types'
import s from './navigation-disclosure-list-item.module.css'

/**
 * Component for rendering the `<li>` elements within a
 * `NavigationDisclosureList`.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureListItem = ({
  children,
  className,
}: NavigationDisclosureListItemProps) => {
  return <li className={classNames(s.root, className)}>{children}</li>
}

export type { NavigationDisclosureListItemProps }
export default NavigationDisclosureListItem
