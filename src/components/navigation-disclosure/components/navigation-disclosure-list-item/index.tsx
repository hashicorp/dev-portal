import classNames from 'classnames'
import { validateNavigationDisclosureListItemChildren } from 'components/navigation-disclosure/helpers/validate-navigation-disclosure-list-item-children'
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
  // validateNavigationDisclosureListItemChildren(children)

  return <li className={classNames(s.root, className)}>{children}</li>
}

export type { NavigationDisclosureListItemProps }
export default NavigationDisclosureListItem
