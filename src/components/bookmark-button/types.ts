export interface BookmarkButtonProps {
	handleOnClick(): void
	isBookmarked: boolean
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
