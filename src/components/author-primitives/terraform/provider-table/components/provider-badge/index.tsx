import React from 'react'
import Badge, { BadgeTheme } from 'components/author-primitives/shared/badge'
import svgRibbonIcon from './ribbon-icon.svg?include'
import svgPartnerIcon from './partner-icon.svg?include'

type ProviderLabelType = 'official' | 'community' | 'partner' | 'archived'

const badgeTypes = {
	official: {
		label: 'Official',
		theme: 'gold',
		iconSvg: svgRibbonIcon,
	},
	community: {
		label: 'Community',
		theme: 'gray',
		iconSvg: false,
	},
	partner: {
		label: 'Partner',
		theme: 'light-blue',
		iconSvg: svgPartnerIcon,
	},
	archived: {
		label: 'Archived',
		theme: 'light-gray',
		iconSvg: false,
	},
}

function ProviderBadge({
	type,
}: {
	type: ProviderLabelType
}): React.ReactElement {
	const { label, theme, iconSvg } = badgeTypes[type]
	return <Badge label={label} theme={theme as BadgeTheme} iconSvg={iconSvg} />
}

export default ProviderBadge
