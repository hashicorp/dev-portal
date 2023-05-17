/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { ReactNode } from 'react'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { SearchableContentType } from 'contexts'
import { CommandBarTag } from 'components/command-bar/types'
import { TabProps } from 'components/tabs/components/tab'
import { generateTutorialLibraryCta } from '../../helpers'
import {
	DocumentationTabContents,
	IntegrationsTabContents,
	TutorialsTabContents,
	SuggestedPage,
} from '..'

/**
 * We require some up-to-date props to render each content type tab.
 */
interface ContentTabProps {
	noResultsMessageSlot: ReactNode
	currentProductTag: CommandBarTag
	suggestedPages: SuggestedPage[]
}

/**
 * Each content type has a set of properties we use to render that
 * tab's content.
 */
interface SearchableContentTypeTab {
	heading: TabProps['heading']
	icon: TabProps['icon']
	renderContent: ({
		noResultsMessageSlot,
		currentProductTag,
		suggestedPages,
	}: ContentTabProps) => TabProps['children']
}

/**
 * Build an object used to render all of the Tab elements, by content type.
 */
export const tabContentByType: Record<
	SearchableContentType,
	SearchableContentTypeTab
> = {
	docs: {
		heading: 'Documentation',
		icon: <IconDocs16 />,
		renderContent: (props: ContentTabProps) => (
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
		renderContent: (props: ContentTabProps) => (
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
		renderContent: (props: ContentTabProps) => (
			<IntegrationsTabContents
				currentProductTag={props.currentProductTag}
				noResultsMessageSlot={props.noResultsMessageSlot}
			/>
		),
	},
}
