/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactElement, ReactNode } from 'react'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { SearchableContentType } from 'contexts'
import { CommandBarTag } from 'components/command-bar/types'
import { generateTutorialLibraryCta } from '../../../helpers'
import { SuggestedPage } from '../../../components'
// TODO: simplify these, all same index now
import IntegrationsTabContents from '../integrations-tab-contents'
import DocumentationTabContents from '../documentation-tab-contents'
import TutorialsTabContents from '../tutorials-tab-contents'
import AllTabContents from '../all-tab-contents'

/**
 * We require some up-to-date props to render each content type tab.
 */
interface RenderContentProps {
	noResultsMessageSlot: ReactNode
	currentProductTag: CommandBarTag
	suggestedPages: SuggestedPage[]
}

/**
 * Each content type has a set of properties we use to render that
 * tab's content.
 */
interface SearchableContentTypeTab {
	heading: string
	icon: ReactElement<React.JSX.IntrinsicElements['svg']>
	renderContent: ({
		noResultsMessageSlot,
		currentProductTag,
		suggestedPages,
	}: RenderContentProps) => ReactNode
}

/**
 * Build an object used to render all of the Tab elements, by content type.
 */
export const tabContentByType: Record<
	SearchableContentType | 'all',
	SearchableContentTypeTab
> = {
	all: {
		heading: 'All',
		icon: <IconDocs16 />,
		renderContent: (props: RenderContentProps) => (
			<AllTabContents
				currentProductTag={props.currentProductTag}
				suggestedPages={props.suggestedPages}
				noResultsMessageSlot={props.noResultsMessageSlot}
			/>
		),
	},
	docs: {
		heading: 'Documentation',
		icon: <IconDocs16 />,
		renderContent: (props: RenderContentProps) => (
			<DocumentationTabContents
				currentProductTag={props.currentProductTag}
				suggestedPages={props.suggestedPages}
				noResultsMessageSlot={props.noResultsMessageSlot}
			/>
		),
	},
	tutorials: {
		heading: 'Tutorials',
		icon: <IconLearn16 />,
		renderContent: (props: RenderContentProps) => (
			<TutorialsTabContents
				currentProductTag={props.currentProductTag}
				tutorialLibraryCta={generateTutorialLibraryCta(props.currentProductTag)}
				noResultsMessageSlot={props.noResultsMessageSlot}
			/>
		),
	},
	integrations: {
		heading: 'Integrations',
		icon: <IconPipeline16 />,
		renderContent: (props: RenderContentProps) => (
			<IntegrationsTabContents
				currentProductTag={props.currentProductTag}
				noResultsMessageSlot={props.noResultsMessageSlot}
			/>
		),
	},
}
