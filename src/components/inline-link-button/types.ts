import { ReactNode } from 'react'

type NativeButtonProps = JSX.IntrinsicElements['button']

export interface InlineLinkButtonProps {
  /**
   * Children to render within the `<button>` element.
   */
  children: ReactNode

  /**
   * A string of one or more classnames to append to the button element.
   */
  className?: NativeButtonProps['className']

  /**
   * The function invoked after the button is clicked. Passed directly to the
   * rendered `<button>` element. Same as the HTML `onClick` attribute.
   */
  onClick?: NativeButtonProps['onClick']
}
