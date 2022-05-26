import { Children, ReactElement } from 'react'
import {
  DisclosureActivator,
  DisclosureContent,
  DisclosureProps,
} from 'components/disclosure'

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
    if (index === 0 && child.type !== DisclosureActivator) {
      throw new Error(`Disclosure first child must be a DisclosureActivator`)
    }

    if (index === 1 && child.type !== DisclosureContent) {
      throw new Error(`Disclosure second child must be a DisclosureContent`)
    }
  })
}

export { validateDisclosureChildren }
