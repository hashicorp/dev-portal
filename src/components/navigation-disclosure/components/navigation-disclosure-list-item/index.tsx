import classNames from 'classnames'
import { NavigationDisclosureListItemProps } from './types'
import s from './navigation-disclosure-list-item.module.css'

const NavigationDisclosureListItem = ({
  children,
  className,
}: NavigationDisclosureListItemProps) => {
  return <li className={classNames(s.root, className)}>{children}</li>
}

export type { NavigationDisclosureListItemProps }
export default NavigationDisclosureListItem
