type NativeButtonProps = JSX.IntrinsicElements['button']

export interface InlineLinkButtonProps {
  /**
   * A string of one or more classnames. Is appended last to list of classnames
   * passed to the button element.
   */
  className?: NativeButtonProps['className']

  /**
   * The text rendered within the `<button>` element.
   */
  text: string

  /**
   * The function invoked after the button is clicked. Passed directly to the
   * rendered `<button>` element. Same as the HTML `onClick` attribute.
   */
  onClick?: NativeButtonProps['onClick']
}
