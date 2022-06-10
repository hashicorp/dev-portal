import { ReactElement } from 'react'
import Link from 'next/link'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { ProductSlug } from 'types/products'
import isAbsoluteUrl from 'lib/is-absolute-url'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import s from './link-navigation-item.module.css'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import Badge from 'components/badge'

const SUPPORTED_LEADING_ICONS: {
  [key in Exclude<SupportedIconName, ProductSlug>]: ReactElement
} = {
  home: <IconHome16 name="home" />,
}

type SupportedIconName = 'home' | ProductSlug

interface LinkNavigationItemProps {
  ariaLabel?: string
  badge?: $TSFixMe
  href?: string
  isActive: boolean
  leadingIconName?: SupportedIconName
  title: string
}

// TODO base off of SidebarNavLinkItem
// TODO use as a container, create shared Content component
const LinkNavigationItem = ({
  badge,
  href,
  isActive,
  leadingIconName,
  title,
}: LinkNavigationItemProps) => {
  const isExternal = isAbsoluteUrl(href)
  const hasBadge = Boolean(badge)

  // Conditionally determining props for the <a>
  const ariaCurrent = !isExternal && isActive ? 'page' : undefined
  const ariaLabel = isExternal ? `${title}. Opens in a new tab.` : undefined
  const anchorClassName = s.root
  const rel = isExternal ? 'noreferrer noopener' : undefined
  const target = isExternal ? '_blank' : undefined

  let leadingIcon
  if (leadingIconName) {
    const icon = SUPPORTED_LEADING_ICONS[leadingIconName] || (
      <ProductIcon productSlug={leadingIconName as ProductSlug} />
    )
    leadingIcon = <div className={s.leadingIcon}>{icon}</div>
  }

  // abstract this, share with expandable nav item
  const anchorContent = (
    <div className={s.navigationItemContent}>
      <div className={s.leftSideContent}>
        {leadingIcon}
        <Text
          asElement="span"
          className={s.navigationItemText}
          dangerouslySetInnerHTML={{ __html: title }}
          size={200}
          weight="regular"
        />
      </div>
      <div className={s.rightSideContent}>
        {hasBadge && (
          <Badge
            color={badge.color}
            size="small"
            text={badge.text}
            type={badge.type}
          />
        )}
        {isExternal && <IconExternalLink16 />}
      </div>
    </div>
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
