import { ReactElement } from 'react'

interface SuggestedPage {
	icon: ReactElement
	text: string
	url: string
}

interface SuggestedPagesListProps {
	suggestedPages: SuggestedPage[]
}

export type { SuggestedPage, SuggestedPagesListProps }
