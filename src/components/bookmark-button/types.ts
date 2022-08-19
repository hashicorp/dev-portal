import { Tutorial } from 'lib/learn-client/types'

export interface BookmarkButtonProps {
	tutorialId: Tutorial['id']
	handleOnClick(): void
}

export type BookmarkAction = 'add' | 'remove'

export type BookmarkButtonConfigType = Record<
	BookmarkAction,
	{
		text: string
		baseIcon: JSX.IntrinsicElements['svg']
		iconWithHover: JSX.IntrinsicElements['svg']
	}
>
