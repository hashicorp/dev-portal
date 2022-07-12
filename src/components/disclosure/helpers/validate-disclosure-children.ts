import { Children, ReactElement } from 'react'
import {
  DisclosureActivator,
  DisclosureContent,
  DisclosureProps,
} from 'components/disclosure'
import {
  NavigationDisclosureActivator,
  NavigationDisclosureContent,
} from 'components/navigation-disclosure'

/**
 * Determines if a child of `Disclosure` is a valid `Activator` component that
 * works with `Disclosure`. Must be updated every time a new abstraction of
 * `DisclosureActivator` is added.
 */
const childIsAValidActivatorComponent = (child: ReactElement): boolean => {
  return (
    child.type === DisclosureActivator ||
    child.type === NavigationDisclosureActivator
  )
}

/**
 * Determines if a child of `Disclosure` is a valid `Content` component that
 * works with `Disclosure`. Must be updated every time a new abstraction of
 * `DisclosureActivator` is added.
 */
const childIsAValidAContentComponent = (child: ReactElement): boolean => {
  return (
    child.type === DisclosureContent ||
    child.type === NavigationDisclosureContent
  )
}

/**
 * Validates that the `children` passed to `Disclosure` are
 * `DisclosureActivator` and `DisclosureContent`.
 */
const validateDisclosureChildren = (children: DisclosureProps['children']) => {
  // validate number of children is correct
  const childCount = Children.count(children)
  if (childCount !== 2) {
    throw new Error(
      `Disclosure expects 2 children but was given ${childCount}.`
    )
  }

  // validate the two children are the correct components
  Children.forEach(children, (child: ReactElement, index: number) => {
    if (index === 0 && !childIsAValidActivatorComponent(child)) {
      throw new Error(`Disclosure first child must be a DisclosureActivator`)
    }

    if (index === 1 && !childIsAValidAContentComponent(child)) {
      throw new Error(`Disclosure second child must be a DisclosureContent`)
    }
  })
}

export { validateDisclosureChildren }
