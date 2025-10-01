/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import Badge, { BadgeTheme } from 'components/author-primitives/shared/badge'
import svgRibbonIcon from './ribbon-icon.svg?include'
import svgPartnerIcon from './partner-icon.svg?include'

const badgeTypes = {
	official: {
		label: 'Official',
		theme: 'gold',
		iconSvg: svgRibbonIcon,
	},
	partnerpremier: {
		label: 'Partner Premier',
		theme: 'light-purple',
		iconSvg: svgPartnerIcon,
	},
	partner: {
		label: 'Partner',
		theme: 'light-blue',
		iconSvg: svgPartnerIcon,
	},
	community: {
		label: 'Community',
		theme: 'gray',
		iconSvg: false,
	},
	archived: {
		label: 'Archived',
		theme: 'light-gray',
		iconSvg: false,
	},
}

type ProviderLabelType = keyof typeof badgeTypes

function ProviderBadge({
	type,
}: {
	type: ProviderLabelType
}): React.ReactElement {
	const { label, theme, iconSvg } = badgeTypes[type]
	return <Badge label={label} theme={theme as BadgeTheme} iconSvg={iconSvg} />
}

export default ProviderBadge
