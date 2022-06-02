import Link from 'next/link'
import s from './button-link.module.css'
import { ButtonProps } from 'components/button/types'
import classNames from 'classnames'

/**
 * _Note WIP Component_
 * this button link component should mimic the design system options
 * outlined in `Button` component. This is a WIP implementation and should be
 * expanded upon. It currently renders a theme colors and sizes, with styles
 * copied from `Button`. Still needs to support: icons
 **/
interface ButtonLinkProps
  extends Pick<
    ButtonProps,
    'color' | 'size' | 'text' | 'ariaLabel' | 'icon' | 'iconPosition'
  > {
  href: string
}

export default function ButtonLink({
  color = 'primary',
  size = 'medium',
  href,
  text,
  ariaLabel,
  icon,
  iconPosition = 'leading',
}: ButtonLinkProps) {
  const hasIcon = !!icon
  const hasText = !!text
  const hasLabel = !!ariaLabel
  const hasLeadingIcon = hasIcon && iconPosition === 'leading'
  const hasTrailingIcon = hasIcon && iconPosition === 'trailing'
  const isIconOnly = hasIcon && !hasText

  if (!hasIcon && !hasText) {
    throw new Error(
      '`Button` must have either `text` or an `icon` with accessible labels.'
    )
  }

  if (isIconOnly && !hasLabel) {
    throw new Error(
      'Icon-only `Button`s require an accessible label. Either provide the `text` prop, or `ariaLabel`.'
    )
  }

  return (
    <Link href={href}>
      <a
        className={classNames(s.root, s[size], s[color])}
        aria-label={ariaLabel}
      >
        {hasLeadingIcon && icon}
        {hasText ? text : null}
        {hasTrailingIcon && icon}
      </a>
    </Link>
  )
}
