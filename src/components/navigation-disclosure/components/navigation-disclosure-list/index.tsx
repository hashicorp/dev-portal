import classNames from 'classnames'
import { NavigationDisclosureListProps } from './types'
import s from './navigation-disclosure-list.module.css'

const NavigationDisclosureList = ({
  children,
  className,
}: NavigationDisclosureListProps) => {
  return <ul className={classNames(s.root, className)}>{children}</ul>
}

export type { NavigationDisclosureListProps }
export default NavigationDisclosureList
