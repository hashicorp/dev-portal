import { TextProps } from 'components/text'

export interface InlineLinkProps {
  /**
   * A string of one or more class names. Applied last to the rendered `<a>` element.
   */
  className?: string

  /**
   * The destination of the link.
   */
  href: string

  /**
   * The text rendered within the `<a>` element.
   */
  text: string

  /**
   * The `size` passed to the inner `Text` component.
   */
  textSize?: TextProps['size']

  /**
   * The `weight` passed to the inner `Text` component.
   */
  textWeight?: TextProps['weight']
}
