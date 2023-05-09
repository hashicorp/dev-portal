/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { type ReactElement, type ReactNode } from 'react'
import { Tutorial as ClientTutorial } from 'lib/learn-client/types'

export interface BookmarkButtonProps {
	handleOnClick(): void
	isBookmarked: boolean
}

export type BookmarkAction = 'add' | 'remove'

export type BookmarkButtonConfigType = Record<
	BookmarkAction,
	{
		text: string
		baseIcon: ReactElement<React.JSX.IntrinsicElements['svg']>
		iconWithHover: ReactNode
	}
>

export interface ConnectedBookmarkComponentProps {
	tutorial: Pick<ClientTutorial, 'id' | 'name'>
}
