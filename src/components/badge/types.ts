import { ReactElement } from 'react'

export interface BadgeProps {
  /**
   * The value of the `id` of the element that describes the badge. The
   * describing element does not have to be visible. If there are multiple
   * labeling elements, this can be be a comma-separated list of `id`s.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-describedby
   */
  ariaDescribedBy?: string

  /**
   * A non-visual label accessible and descriptive label for the badge.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-label
   */
  ariaLabel?: string

  /**
   * The value of the `id` of the element that labels the badge. The labeling
   * element does not have to be visible. If there are multiple labeling
   * elements, this can be be a comma-separated list of `id`s.
   *
   * See: https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby
   */
  ariaLabelledBy?: string

  /**
   * The name of the color to apply styles to the badge. The default value is
   * "neutral".
   */
  color?:
    | 'error'
    | 'highlight'
    | 'neutral-dark-mode'
    | 'neutral'
    | 'success'
    | 'warning'

  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconAlertTriangle16 } from '@hashicorp/flight-icons/svg-react/alert-triangle-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <Badge
   *      color="warning"
   *      icon={<IconAlertTriangle16 />}
   *      text="Cost estimated"
   *    />
   *  )
   * }
   * ```
   */
  icon?: ReactElement

  /**
   * The size of the badge, which mainly affects font size and padding. The
   * default value is "medium".
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * The text to render inside of the badge. This is not required for icon-only
   * badges.
   */
  text?: string

  /**
   * The kind of style to apply to the badge, which mainly affects background
   * color and border.
   */
  type?: 'filled' | 'inverted' | 'outlined'
}
