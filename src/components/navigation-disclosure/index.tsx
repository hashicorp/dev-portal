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
 * Abstraction on top of `Disclosure`. Intended to be used for disclosed content
 * that contains `<a>` elements. When used alone, should be wrapped in a `<nav>`
 * element. When used in a group of `NavigationDisclosure`s, the group should be
 * wrapped in a `<nav>` element.
 *
 * @TODO
 *  - wrap with forwardRef (for `NavigationHeaderDropdownMenu`)
 *  - add onMouseLeave listener (for `NavigationHeaderDropdownMenu`)
 */
const NavigationDisclosure = ({
  children,
  className,
}: NavigationDisclosureProps) => {
  return (
    <Disclosure
      closeOnClickOutside
      closeOnFocusOutside
      containerClassName={className}
    >
      {children}
    </Disclosure>
  )
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
