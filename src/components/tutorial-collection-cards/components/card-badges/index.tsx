import { IconPlay16 } from '@hashicorp/flight-icons/svg-react/play-16'
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import { ProductOption } from 'lib/learn-client/types'
import Badge from 'components/badge'
import ProductIcon from 'components/product-icon'
import { CardBadgesProps, CardBadgeOption } from './types'
import s from './card-badges.module.css'
import Tooltip from 'components/tooltip'

/**
 * Map product badge options to icons
 */
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
/**
 * Map all card badge options to icons
 */
const CARD_BADGE_ICON_MAP: Record<CardBadgeOption, JSX.Element> = {
	...PRODUCT_ICON_MAP,
	video: <IconPlay16 />,
	interactive: <IconTerminalScreen16 />,
}

/**
 * Map product badge options to badge labels
 */
const PRODUCT_LABEL_MAP: Record<ProductOption, string> = {
	boundary: 'Boundary',
	consul: 'Consul',
	nomad: 'Nomad',
	packer: 'Packer',
	terraform: 'Terraform',
	vault: 'Vault',
	vagrant: 'Vagrant',
	waypoint: 'Waypoint',
}
/**
 * Map all card badge options to badge labels
 */
const CARD_BADGE_LABEL_MAP: Record<CardBadgeOption, string> = {
	...PRODUCT_LABEL_MAP,
	video: 'Video',
	interactive: 'Interactive',
}

function CardBadges({ badges }: CardBadgesProps) {
	return (
		<ul className={s.root}>
			{badges.map((badge: CardBadgeOption) => {
				return (
					<li className={s.listItem} key={badge}>
						<Tooltip label={CARD_BADGE_LABEL_MAP[badge]}>
							<Badge
								ariaLabel={CARD_BADGE_LABEL_MAP[badge]}
								icon={CARD_BADGE_ICON_MAP[badge]}
								size="small"
							/>
						</Tooltip>
					</li>
				)
			})}
		</ul>
	)
}

export { CardBadges }
