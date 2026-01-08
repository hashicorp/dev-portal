/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { ProductOption } from 'lib/learn-client/types'
import { Badge, type FlightIconName } from '@hashicorp/mds-react/components'
import { CardBadgesProps, CardBadgeOption } from './types'
import s from './card-badges.module.css'
import Tooltip from 'components/tooltip'

/**
 * Map product badge options to icons
 */
const PRODUCT_ICON_MAP: Record<ProductOption, FlightIconName> = {
	boundary: 'boundary-color',
	consul: 'consul-color',
	nomad: 'nomad-color',
	packer: 'packer-color',
	terraform: 'terraform-color',
	vault: 'vault-color',
	vagrant: 'vagrant-color',
	waypoint: 'waypoint-color',
	sentinel: 'hcp',
}
/**
 * Map all card badge options to icons
 */
const CARD_BADGE_ICON_MAP: Record<CardBadgeOption, FlightIconName> = {
	...PRODUCT_ICON_MAP,
	video: 'play',
	interactive: 'terminal-screen',
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
	sentinel: 'Sentinel',
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
								accessibleText={CARD_BADGE_LABEL_MAP[badge]}
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
