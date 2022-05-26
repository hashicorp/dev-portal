import Disclosure from 'components/disclosure'
import { NavigationDisclosureProps } from './types'
import {
  NavigationDisclosureActivator,
  NavigationDisclosureActivatorProps,
  NavigationDisclosureContent,
  NavigationDisclosureContentProps,
  NavigationDisclosureLink,
  NavigationDisclosureLinkProps,
  NavigationDisclosureList,
  NavigationDisclosureListItem,
  NavigationDisclosureListItemProps,
  NavigationDisclosureListProps,
} from './components'

/**
 * @TODO
 *  - add use of useOnClickOutside ('hooks/use-on-click-outside')
 *  - add use of useOnFocusOutside ('hooks/use-on-focus-outside')
 *
 * Notes for documentation:
 *  - should be rendered inside of a <nav>
 */
const NavigationDisclosure = ({
  children,
  className,
}: NavigationDisclosureProps) => {
  return <Disclosure containerClassName={className}>{children}</Disclosure>
}

export type {
  NavigationDisclosureActivatorProps,
  NavigationDisclosureContentProps,
  NavigationDisclosureLinkProps,
  NavigationDisclosureListItemProps,
  NavigationDisclosureListProps,
  NavigationDisclosureProps,
}
export {
  NavigationDisclosureActivator,
  NavigationDisclosureContent,
  NavigationDisclosureLink,
  NavigationDisclosureList,
  NavigationDisclosureListItem,
}
export default NavigationDisclosure
