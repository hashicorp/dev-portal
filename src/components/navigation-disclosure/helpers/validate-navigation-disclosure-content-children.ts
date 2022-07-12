import { Children, ReactElement } from 'react'
import { NavigationDisclosureList } from '../components'

/**
 * Validates that the child passed to `NavigationDisclosureContent` is
 * `NavigationDisclosureList`.
 */
const validateNavigationDisclosureContentChildren = (
  children: ReactElement
) => {
  const childCount = Children.count(children)
  if (childCount != 1) {
    throw new Error(
      `NavigationDisclosureContent expects one child but was given ${childCount}`
    )
  }

  /**
   * @TODO shouldn't have to cast this, but there's an error because
   * `Children.only`'s signature says the return type is `never`. Maybe some
   * dependencies aren't aligned?
   */
  const child = Children.only(children) as ReactElement
  if (child.type !== NavigationDisclosureList) {
    throw new Error(
      `NavigationDisclosureContent only accepts a child of type NavigationDisclosureList`
    )
  }
}

export { validateNavigationDisclosureContentChildren }
