import { ReactElement } from 'react'
import { TextProps } from 'components/text'

export interface StandaloneLinkProps {
  /**
   * A non-visible label presented by screen readers. Passed directly to the
   * internal link element as the `aria-label` prop.
   *
   * ref: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
   */
  ariaLabel?: string

  /**
   * A string of one or more class names. Applied last to the rendered `<a>`
   * element.
   */
  className?: string

  /**
   * Determines the set of colors to use for various states of the component.
   */
  color?: 'primary' | 'secondary'

  /**
   * Same as the <a> element's download prop. Passed directly to the internal
   * link element.
   *
   * ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
   */
  download?: boolean | string

  /**
   * The destination of the link.
   */
  href: string

  /**
   * An icon from `@hashicorp/flight-icons` to render.
   *
   * Example:
   *
   * ```jsx
   * import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
   *
   * const MyComponent = () => {
   *  return (
   *    <StandaloneLink
   *      href="/"
   *      icon={<IconArrowRight16 />}
   *      iconPosition="trailing"
   *      text="Get Started"
   *    />
   *  )
   * }
   * ```
   */
  icon: ReactElement

  /**
   * Where the icon should be rendered within the link. See examples below.
   */
  iconPosition: 'leading' | 'trailing'

  /**
   * The text rendered within the `<a>` element.
   */
  text: string

  /**
   * The `size` passed to the inner `Text` component.
   */
  textSize?: TextProps['size']
}
