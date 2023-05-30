/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { IconArchive16 } from '@hashicorp/flight-icons/svg-react/archive-16'
import { IconEnterprise16 } from '@hashicorp/flight-icons/svg-react/enterprise-16'
import { IconHandshake16 } from '@hashicorp/flight-icons/svg-react/handshake-16'
import { IconHashicorp16 } from '@hashicorp/flight-icons/svg-react/hashicorp-16'
import { IconRocket16 } from '@hashicorp/flight-icons/svg-react/rocket-16'
import { IconUsers16 } from '@hashicorp/flight-icons/svg-react/users-16'
import { IconWrench16 } from '@hashicorp/flight-icons/svg-react/wrench-16'
import { Badge } from 'components/badge-list/types'
import { Flag, Integration, Tier } from './integrations-api-client/integration'

// Converts an Integration object into an array of Badges to be used by our badge-list
export function getIntegrationBadges(
	integration: Integration,
	tierFirst: boolean
): Array<Badge> {
	let tierBadge: Badge
	switch (integration.tier) {
		case Tier.OFFICIAL:
			tierBadge = {
				text: 'Official',
				icon: <IconHashicorp16 />,
				tooltip: 'Official integrations are owned and maintained by HashiCorp.',
			}
			break

		case Tier.PARTNER:
			tierBadge = {
				text: 'Partner',
				icon: <IconHandshake16 />,
				tooltip:
					'Partner integrations are written, maintained, validated and published by third-party companies. To earn a partner provider badge the partner must participate in the HashiCorp Technology Partner Program.',
			}
			break

		case Tier.COMMUNITY:
			tierBadge = {
				text: 'Community',
				icon: <IconUsers16 />,
				tooltip:
					'Community integrations are published by individual maintainers, groups of maintainers, or other members of the HashiCorp community.',
			}
			break
	}

	let typeBadge: Badge
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
		...integration.flags.map((flag: Flag) => {
			let icon = undefined
			switch (flag.slug) {
				case 'builtin':
					icon = <IconWrench16 />
					break

				case 'hcp-ready':
					icon = <IconRocket16 />
					break

				case 'archived':
					icon = <IconArchive16 />
					break

				case 'enterprise':
					icon = <IconEnterprise16 />
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
