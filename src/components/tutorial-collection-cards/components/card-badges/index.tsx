import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { ProductOption } from 'lib/learn-client/types'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import { CardBadgesProps, CardBadgeOption } from './types'
import s from './card-badges.module.css'

const PRODUCT_ICON_MAP: Record<ProductOption, JSX.Element> = {
  boundary: <ProductIcon productSlug="boundary" />,
  consul: <ProductIcon productSlug="consul" />,
  nomad: <ProductIcon productSlug="nomad" />,
  packer: <ProductIcon productSlug="packer" />,
  terraform: <ProductIcon productSlug="terraform" />,
  vault: <ProductIcon productSlug="vault" />,
  vagrant: <ProductIcon productSlug="vagrant" />,
  waypoint: <ProductIcon productSlug="waypoint" />,
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
