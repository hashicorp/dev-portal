import { Children, ReactElement } from 'react'
import NavigationDisclosure from '..'
import { NavigationDisclosureLink } from '../components'

/**
 * Validates that the child passed to `NavigationDisclosureListItem` is
 * `NavigationDisclosureLink`.
 */
const validateNavigationDisclosureListItemChildren = (
  children: ReactElement
) => {
  const childCount = Children.count(children)
  if (childCount != 1) {
    throw new Error(
      `NavigationDisclosureListItem expects 1 child but was given ${childCount}`
    )
  }

  /**
   * @TODO shouldn't have to cast this, but there's an error because
   * `Children.only`'s signature says the return type is `never`. Maybe some
   * dependencies aren't aligned?
   */
  const child = Children.only(children) as ReactElement
  if (
    child.type !== NavigationDisclosureLink &&
    child.type !== NavigationDisclosure
  ) {
    throw new Error(
      `NavigationDisclosureListItem only accepts a child of type NavigationDisclosureLink or NavigationDisclosure. Was given: "${child.type.toString()}"`
    )
  }
}

export { validateNavigationDisclosureListItemChildren }
