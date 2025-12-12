/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { BadgeListBadgeProps } from '@components/badge-list/types'
import { Flag, Integration, Tier } from './integrations-api-client/integration'

// Converts an Integration object into an array of Badges to be used by our badge-list
export function getIntegrationBadges(
	integration: Integration,
	tierFirst: boolean
): Array<BadgeListBadgeProps> {
	let tierBadge: BadgeListBadgeProps
	switch (integration.tier) {
		case Tier.OFFICIAL:
			tierBadge = {
				text: 'Official',
				icon: 'hashicorp',
				tooltip: 'Official integrations are owned and maintained by HashiCorp.',
			}
			break

		case Tier.PARTNER:
			tierBadge = {
				text: 'Partner',
				icon: 'handshake',
				tooltip:
					'Partner integrations are written, maintained, validated and published by third-party companies. To earn a partner provider badge the partner must participate in the HashiCorp Technology Partner Program.',
			}
			break

		case Tier.COMMUNITY:
			tierBadge = {
				text: 'Community',
				icon: 'users',
				tooltip:
					'Community integrations are published by individual maintainers, groups of maintainers, or other members of the HashiCorp community.',
			}
			break
	}

	let typeBadge: BadgeListBadgeProps
	if (integration.integration_type) {
		typeBadge = {
			text: integration.integration_type.name,
			tooltip: integration.integration_type.description,
		}
	}

	return [
		// Be sure to keep this tierFirst entry here as the first item
		...(tierFirst ? [tierBadge] : []),
		...(typeBadge ? [typeBadge] : []),
		...integration.flags.map((flag: Flag): BadgeListBadgeProps => {
			let icon: BadgeListBadgeProps['icon'] = undefined
			switch (flag.slug) {
				case 'builtin':
					icon = 'wrench'
					break

				case 'hcp-ready':
					icon = 'rocket'
					break

				case 'archived':
					icon = 'archive'
					break

				case 'enterprise':
					icon = 'enterprise'
					break
			}

			return {
				text: flag.name,
				tooltip: flag.description,
				icon: icon,
			}
		}),
		// Be sure to keep this tierFirst entry here as the last item
		...(tierFirst ? [] : [tierBadge]),
	]
}
