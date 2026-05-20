/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import {
	Badge,
	type BadgeProps,
	type FlightIconName,
} from '@hashicorp/mds-react/components'
import LegacyBadge, {
	type BadgeTheme,
} from 'components/author-primitives/shared/badge'

const hdsBadgeTypes = {
	official: {
		text: 'Official',
		type: 'outlined',
		color: 'neutral',
		icon: 'award',
	},
	partnerpremier: {
		text: 'Partner Premier',
		type: 'outlined',
		color: 'highlight',
		icon: 'handshake',
	},
	partner: {
		text: 'Partner',
		type: 'filled',
		color: 'highlight',
		icon: 'handshake',
	},

} satisfies Record<
	string,
	{
		text: string
		type: BadgeProps['type']
		color: BadgeProps['color']
		icon?: FlightIconName
	}
>

const legacyBadgeTypes = {
	community: {
		label: 'Community',
		theme: 'gray',
	},
	archived: {
		label: 'Archived',
		theme: 'light-gray',
	},
} satisfies Record<
	string,
	{
		label: string
		theme: BadgeTheme
	}
>

type ProviderLabelType = keyof typeof hdsBadgeTypes | keyof typeof legacyBadgeTypes

function ProviderBadge({
	type,
}: {
	type: ProviderLabelType
}): React.ReactElement {
	if (type in hdsBadgeTypes) {
		const { text, color, icon, type: badgeType } = hdsBadgeTypes[type]
		return (
			<Badge
				text={text}
				size="medium"
				type={badgeType}
				color={color}
				icon={icon}
			/>
		)
	}

	const { label, theme } = legacyBadgeTypes[type]
	return <LegacyBadge label={label} theme={theme} />
}

export default ProviderBadge
