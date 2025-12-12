/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import { Badge, type FlightIconName } from '@hashicorp/mds-react/components'

const BADGE_TYPES = {
	official: {
		label: 'Official',
		iconName: 'hashicorp',
	},
	community: {
		label: 'Community',
		iconName: 'users',
	},
	hcp_packer_ready: {
		label: 'HCP Packer Ready',
		iconName: 'rocket',
	},
	verified: {
		label: 'Verified',
		iconName: 'award',
	},
	archived: {
		label: 'Archived',
		iconName: 'archive',
	},



} satisfies Record<
	string,
	{ label: string; iconName: FlightIconName }
>

type PluginLabelType = keyof typeof BADGE_TYPES

function PluginBadge({ type }: { type: PluginLabelType }): React.ReactElement {
	const { label, iconName } = BADGE_TYPES[type]
	return <Badge text={label} size="small" type="outlined" icon={iconName} />
}

export default PluginBadge
