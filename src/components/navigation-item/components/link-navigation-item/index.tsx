import Link from 'next/link'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import isAbsoluteUrl from 'lib/is-absolute-url'
import NavigationItemContent, {
  NavigationItemContentProps,
} from '../navigation-item-content'
import s from './link-navigation-item.module.css'

interface LinkNavigationItemProps {
  ariaLabel?: string
  badge?: $TSFixMe
  href?: string
  isActive: boolean
  leadingIconName?: NavigationItemContentProps['leadingIconName']
  title: string
}

const LinkNavigationItem = ({
  badge,
  href,
  isActive,
  leadingIconName,
  title,
}: LinkNavigationItemProps) => {
  const isExternal = isAbsoluteUrl(href)
  const ariaCurrent = !isExternal && isActive ? 'page' : undefined
  const ariaLabel = isExternal ? `${title}. Opens in a new tab.` : undefined
  const anchorClassName = s.root
  const rel = isExternal ? 'noreferrer noopener' : undefined
  const target = isExternal ? '_blank' : undefined

  let trailingIcon
  if (isExternal) {
    trailingIcon = <IconExternalLink16 />
  }

  const anchorContent = (
    <NavigationItemContent
      badge={badge}
      leadingIconName={leadingIconName}
      text={title}
      trailingIcon={trailingIcon}
    />
  )

  if (href) {
    // link is not "disabled"
    return (
      <Link href={href}>
        <a
          aria-current={ariaCurrent}
          aria-label={ariaLabel}
          className={anchorClassName}
          rel={rel}
          target={target}
        >
          {anchorContent}
        </a>
      </Link>
    )
  } else {
    // link is "disabled"
    return (
      <a
        aria-disabled
        aria-label={ariaLabel}
        className={anchorClassName}
        tabIndex={0}
      >
        {anchorContent}
      </a>
    )
  }
}

export default LinkNavigationItem
