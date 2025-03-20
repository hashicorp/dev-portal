/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Icons
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconGrid16 } from '@hashicorp/flight-icons/svg-react/grid-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
// Types
import type { ReactElement } from 'react'
import type { UnifiedSearchableContentType } from './types'

/**
 * Basic heading and icon content for each tab, which we'll build on.
 */
export const tabContentByType: Record<
	UnifiedSearchableContentType,
	{
		heading: string
		icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	}
> = {
	global: {
		heading: 'All',
		icon: <IconGrid16 />,
	},
	docs: {
		heading: 'Documentation',
		icon: <IconDocs16 />,
	},
	tutorial: {
		heading: 'Tutorials',
		icon: <IconLearn16 />,
	},
	integration: {
		heading: 'Integrations',
		icon: <IconPipeline16 />,
	},
	zendesk: {
		heading: 'Zendesk',
		icon: <IconDocs16 />,
	},
}
