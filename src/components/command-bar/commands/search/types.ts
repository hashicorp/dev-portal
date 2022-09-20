import { ReactElement } from 'react'

interface SuggestedPage {
	icon: ReactElement
	text: string
	url: string
}

interface SuggestedPagesProps {
	pages: SuggestedPage[]
}

export type { SuggestedPage, SuggestedPagesProps }
