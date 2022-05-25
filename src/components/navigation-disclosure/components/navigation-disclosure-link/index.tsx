import Link from 'next/link'
import { NavigationDisclosureLinkProps } from './types'
import s from './navigation-disclosure-link.module.css'
import classNames from 'classnames'

const NavigationDisclosureLink = ({
  isActive,
  children,
  className,
  href,
}: NavigationDisclosureLinkProps) => {
  let ariaCurrent: JSX.IntrinsicElements['a']['aria-current']
  if (isActive) {
    ariaCurrent = 'page'
  }

  return (
    <Link href={href}>
      <a aria-current={ariaCurrent} className={classNames(s.root, className)}>
        {children}
      </a>
    </Link>
  )
}

export type { NavigationDisclosureLinkProps }
export default NavigationDisclosureLink
