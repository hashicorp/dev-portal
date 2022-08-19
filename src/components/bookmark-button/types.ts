export interface BookmarkButtonProps {
	isBookmarked: boolean
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
