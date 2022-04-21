import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { ProductOption } from 'lib/learn-client/types'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import { CardBadgesProps, CardBadgeOption } from './types'
import s from './card-badges.module.css'

/**
 * Potential optimization:
 * Figure out a way to remove Partial<> from PRODUCT_ICON_MAP's type
 *
 * Partial<> seems necessary during construction of the map,
 * but it doesn't feel accurate for the resulting PRODUCT_ICON_MAP...
 * We know it has every key, it's not a partial in that sense...
 *
 * This would also let us avoid having to cast PRODUCT_ICON_MAP
 * when spreading to CARD_BADGE_MAP
 *
 * Deferred this as I couldn't get it to work as expected TypeScript.
 */
const PRODUCT_ICON_MAP: Partial<Record<ProductOption, JSX.Element>> =
  Object.keys(ProductOption).reduce((acc, slug: ProductOption) => {
    acc[slug] = <ProductIcon productSlug={slug} />
    return acc
  }, {})
const CARD_BADGE_MAP: Record<CardBadgeOption, JSX.Element> = {
  ...(PRODUCT_ICON_MAP as Record<ProductOption, JSX.Element>),
  video: <IconPlay16 />,
  interactive: <IconTerminalScreen16 />,
}

function CardBadges({ badges }: CardBadgesProps) {
  return (
    <ul className={s.root}>
      {badges.map((badge: CardBadgeOption) => {
        return (
          <li key={badge}>
            <Badge
              ariaLabel={badge}
              icon={CARD_BADGE_MAP[badge]}
              className={s.badge}
            />
          </li>
        )
      })}
    </ul>
  )
}

export { CardBadges }
