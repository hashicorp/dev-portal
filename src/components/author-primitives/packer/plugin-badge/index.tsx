/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import React from 'react'
import Badge from 'components/badge'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconRocket16 } from '@hashicorp/flight-icons/svg-react/rocket-16'
import { IconUsers16 } from '@hashicorp/flight-icons/svg-react/users-16'
import { IconHashicorp16 } from '@hashicorp/flight-icons/svg-react/hashicorp-16'
import { IconArchive16 } from '@hashicorp/flight-icons/svg-react/archive-16'

type PluginLabelType =
	| 'official'
	| 'community'
	| 'hcp_packer_ready'
	| 'verified'
	| 'archived'

const badgeTypes = {
	official: {
		label: 'Official',
		iconSvg: <IconHashicorp16 />,
	},
	community: {
		label: 'Community',
		iconSvg: <IconUsers16 />,
	},
	hcp_packer_ready: {
		label: 'HCP Packer Ready',
		iconSvg: <IconRocket16 />,
	},
	verified: {
		label: 'Verified',

		iconSvg: <IconAward16 />,
	},
	archived: {
		label: 'Archived',
		iconSvg: <IconArchive16 />,
	},
}

function PluginBadge({ type }: { type: PluginLabelType }): React.ReactElement {
	const { label, iconSvg } = badgeTypes[type]
	return <Badge text={label} size="small" type="outlined" icon={iconSvg} />
}

export default PluginBadge
