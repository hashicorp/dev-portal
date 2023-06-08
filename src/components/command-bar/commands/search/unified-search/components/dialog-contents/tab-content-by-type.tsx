/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement } from 'react'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { SearchableContentType } from 'contexts'

/**
 * Each content type has a set of properties we use to render that
 * tab's content.
 */
interface SearchableContentTypeTab {
	heading: string
	icon: ReactElement<React.JSX.IntrinsicElements['svg']>
}

/**
 * Build an object used to render all of the Tab elements, by content type.
 *
 * TODO: all renderContent are pretty much the same, should pull this apart
 * a little bit more.
 */
export const tabContentByType: Record<
	SearchableContentType | 'all',
	SearchableContentTypeTab
> = {
	all: {
		heading: 'All',
		icon: <IconDocs16 />,
	},
	docs: {
		heading: 'Documentation',
		icon: <IconDocs16 />,
	},
	tutorials: {
		heading: 'Tutorials',
		icon: <IconLearn16 />,
	},
	integrations: {
		heading: 'Integrations',
		icon: <IconPipeline16 />,
	},
}
