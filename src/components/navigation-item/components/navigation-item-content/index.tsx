import { ReactElement } from 'react'
import { IconHome16 } from '@hashicorp/flight-icons/svg-react/home-16'
import { ProductSlug } from 'types/products'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import Text from 'components/text'
import { NavigationItemContentProps, SupportedIconName } from './types'
import s from './navigation-item-content.module.css'

const SUPPORTED_LEADING_ICONS: {
  [key in Exclude<SupportedIconName, ProductSlug>]: ReactElement
} = {
  home: <IconHome16 name="home" />,
}

const NavigationItemContent = ({
  badge,
  leadingIconName,
  text,
  trailingIcon,
}: NavigationItemContentProps) => {
  let leadingIcon
  if (leadingIconName) {
    const icon = SUPPORTED_LEADING_ICONS[leadingIconName] || (
      <ProductIcon productSlug={leadingIconName as ProductSlug} />
    )
    leadingIcon = <div className={s.leadingIcon}>{icon}</div>
  }

  let badgeElement
  if (badge) {
    badgeElement = (
      <Badge
        color={badge.color}
        size="small"
        text={badge.text}
        type={badge.type}
      />
    )
  }

  return (
    <div className={s.root}>
      <div className={s.leftSide}>
        {leadingIcon}
        <Text
          asElement="span"
          className={s.text}
          dangerouslySetInnerHTML={{ __html: text }}
          size={200}
          weight="regular"
        />
      </div>
      <div className={s.rightSide}>
        {badgeElement}
        {trailingIcon}
      </div>
    </div>
  )
}

export type { NavigationItemContentProps }
export default NavigationItemContent
