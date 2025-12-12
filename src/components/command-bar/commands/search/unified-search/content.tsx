/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Types
import { type FlightIconName } from '@hashicorp/mds-react/components'
import type { SearchContentTypes } from './types'

/**
 * Basic heading and icon content for each tab, which we'll build on.
 */
export const tabContentByType: Record<
	SearchContentTypes,
	{
		heading: string
		icon: FlightIconName
	}
> = {
	global: {
		heading: 'All',
		icon: 'grid',
	},
	docs: {
		heading: 'Documentation',
		icon: 'docs',
	},
	tutorial: {
		heading: 'Tutorials',
		icon: 'learn',
	},
	integration: {
		heading: 'Integrations',
		icon: 'pipeline',
	},
	knowledgebase: {
		heading: 'Support',
		icon: 'support',
	},
}
