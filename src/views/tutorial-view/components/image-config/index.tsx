import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react'
import classNames from 'classnames'

/**
 * Wrapper component for MDX images, formerly used to apply border styles.
 *
 * Maintained here only as a way to keep being noisy about deprecation,
 * and ensure we root out all content uses before removing the component.
 *
 * Source from learn:
 * https://github.com/hashicorp/learn/blob/bc7063379fd8d078448415e2c16fcd0b687048af/components/image-config/index.tsx#L28
 */
export default function ImageConfig({
  children,
}: {
  children: ReactNode
}): ReactElement {
  // This component is deprecated, so emit a warning on any use
  console.warn(
    `Warning: <ImageConfig /> is deprecated, and does nothing. Please remove it from content.`
  )

  //  safely assert that ReactNode is a ReactElement
  //  ref: https://stackoverflow.com/a/42261933/2522025
  if (isValidElement(children)) {
    //  ensure that there is only one child https://reactjs.org/docs/react-api.html#reactchildrenonly
    return Children.only(
      cloneElement(children, {
        //  preserve the existing className if present
        className: classNames(children.props?.className),
      })
    )
  } else {
    //  error on multiple/invalid children
    throw new Error(`<ImageConfig /> received invalid children`)
  }
}
