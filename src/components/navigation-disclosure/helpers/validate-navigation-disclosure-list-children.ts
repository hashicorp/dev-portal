import { Children, ReactElement } from 'react'
import {
  NavigationDisclosureListItem,
  NavigationDisclosureListProps,
} from '../components'

/**
 * Validates that the `children` passed to `NavigationDisclosureList` are
 * `NavigationDisclosureListItem`.
 */
const validateNavigationDisclosureListChildren = (
  children: NavigationDisclosureListProps['children']
) => {
  Children.forEach(children, (child: ReactElement) => {
    if (child.type !== NavigationDisclosureListItem) {
      throw new Error(
        `NavigationDisclosureList only accepts children of type NavigationDisclosureListItem`
      )
    }
  })
}

export { validateNavigationDisclosureListChildren }
