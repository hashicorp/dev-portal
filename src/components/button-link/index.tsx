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
  extends Pick<ButtonProps, 'color' | 'size' | 'text' | 'ariaLabel'> {
  href: string
}

export default function ButtonLink({
  color = 'primary',
  size = 'medium',
  href,
  text,
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link href={href}>
      <a
        className={classNames(s.root, s[size], s[color])}
        aria-label={ariaLabel}
      >
        {text}
      </a>
    </Link>
  )
}
