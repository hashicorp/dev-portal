import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'
import { CardBadgesProps, CardBadgeOption } from './types'
import s from './card-badges.module.css'

/**
 * Potential optimization: construct this map
 * from productSlugs in `lib/products`, eg:
 *
 * function buildProductIconMap(): Record<ProductSlug, JSX.Element> {
 *   const icons = {}
 *   for (const slug of productSlugs) {
 *     icons[slug] = <ProductIcon productSlug={slug} />
 *   }
 *   return icons
 * }
 *
 * Deferred this as I couldn't get it to work as expected TypeScript.
 */
const PRODUCT_ICON_MAP: Record<ProductSlug, JSX.Element> = {
  boundary: <ProductIcon productSlug="boundary" />,
  consul: <ProductIcon productSlug="consul" />,
  nomad: <ProductIcon productSlug="nomad" />,
  packer: <ProductIcon productSlug="packer" />,
  sentinel: <ProductIcon productSlug="sentinel" />, // note: is null!
  terraform: <ProductIcon productSlug="terraform" />,
  vault: <ProductIcon productSlug="vault" />,
  vagrant: <ProductIcon productSlug="vagrant" />,
  waypoint: <ProductIcon productSlug="waypoint" />,
  hcp: <ProductIcon productSlug="hcp" />,
}
const CARD_BADGE_MAP: Record<CardBadgeOption, JSX.Element> = {
  ...PRODUCT_ICON_MAP,
  video: <IconPlay16 />,
  interactive: <IconTerminalScreen16 />,
}

function CardBadges({ badges }: CardBadgesProps) {
  return (
    <ul className={s.root}>
      {badges.map((badge: CardBadgeOption) => {
        // Handle null Sentinel icon case
        if (badge == 'sentinel') {
          return null
        }
        // Otherwise, we know an icon will render
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
