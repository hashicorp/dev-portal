import { ReactElement } from 'react'

type NativeButtonProps = JSX.IntrinsicElements['button']

export interface ButtonProps {
  /**
   * The value of the `id` of the element that describes the action a button
   * allows a user to do. The describing element does not have to be visible. If
   * there are multiple labeling elements, this can be be a comma-separated list
   * of `id`s.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-describedby
   */
  ariaDescribedBy?: NativeButtonProps['aria-describedby']

  /**
   * A non-visual label accessible and descriptive label for the action a button
   * allows the user to do.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-label
   */
  ariaLabel?: NativeButtonProps['aria-label']

  /**
   * The value of the `id` of the element that labels the button. The labeling
   * element does not have to be visible. If there are multiple labeling
   * elements, this can be be a comma-separated list of `id`s.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby
   */
  ariaLabelledBy?: NativeButtonProps['aria-labelledby']

  /**
   * @TODO write description
   */
  className?: NativeButtonProps['className']

  /**
   * The name of the color to apply styles to the button. The default value is
   * "primary".
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'critical'

  /**
   * Whether or not the button should have all interaction disabled. Same as the
   * HTML `disabled` attribute.
   */
  disabled?: NativeButtonProps['disabled']

  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconClipboardCopy16 } from '@hashicorp/flight-icons/svg-react/clipboard-copy-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <Button
   *      icon={<IconClipboardCopy16 />}
   *      text="Copy to clipboard"
   *    />
   *  )
   * }
   * ```
   */
  icon?: ReactElement

  /**
   * Where the icon should be rendered within the button. 'leading' will render
   * the icon before `text`, 'trailing' will render the icon after `text`. The
   * default value is "leading".
   */
  iconPosition?: 'leading' | 'trailing'

  /**
   * The string `id` to give the rendered `<button>` element. Same as the HTML
   * `id` attribute.
   */
  id?: NativeButtonProps['id']

  /**
   * Whether or not the button should take up the full width of its container.
   * Buttons do not take up their container's full width by default.
   */
  isFullWidth?: boolean

  /**
   * The string `name` to give the rendered `<button>` element. Same as the HTML
   * `name` attribute.
   */
  name?: NativeButtonProps['name']

  /**
   * The function invoked after the button is clicked. Passed directly to the
   * rendered `<button>` element. Same as the HTML `onClick` attribute.
   */
  onClick?: NativeButtonProps['onClick']

  /**
   * The size of the button, which mainly affects font size and padding.
   * The default value is "medium".
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * The text to render inside of the button. This is not required for icon-only
   * buttons.
   */
  text?: string

  /**
   * The `type` to give the rendered `<button>` element. Same as the HTML `type`
   * attribute for button elements.
   */
  type?: NativeButtonProps['type']
}
