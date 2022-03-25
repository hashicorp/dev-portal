import { BadgeProps } from 'components/badge'

export interface CountBadgeProps extends Pick<BadgeProps, 'size' | 'type'> {
  /**
   * The name of the color to apply styles to the count badge. Passed directly
   * to `Badge`. The default value is "neutral".
   */
  color?: 'neutral' | 'neutral-dark-mode'

  /**
   * The text to render inside of the count badge. Passed directly to `Badge`.
   */
  text: BadgeProps['text']
}
