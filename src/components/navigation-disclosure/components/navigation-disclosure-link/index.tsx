import classNames from 'classnames'
import Link from 'next/link'
import { NavigationDisclosureLinkProps } from './types'
import s from './navigation-disclosure-link.module.css'

/**
 * Component for rendering the `<a>` elements within a
 * `NavigationDisclosureListItem`. Uses `next/link` and handles setting
 * `aria-current` based on the required `isActive` prop.
 *
 * @see https://developer.hashi-mktg.com/swingset/components/navigationdisclosure
 */
const NavigationDisclosureLink = ({
  children,
  className,
  href,
  isActive,
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
