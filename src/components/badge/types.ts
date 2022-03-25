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
   * TODO: document other props
   */
  color?:
    | 'error'
    | 'highlight'
    | 'neutral-dark-mode'
    | 'neutral'
    | 'success'
    | 'warning'
  icon?: ReactElement
  size?: 'small' | 'medium' | 'large'
  text?: string
  type?: 'filled' | 'inverted' | 'outlined'
}
