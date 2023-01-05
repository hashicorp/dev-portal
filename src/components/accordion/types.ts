import { ReactNode } from 'react'

export type AccordionContentItem = {
	title: string
	content: ReactNode
	initialOpen?: boolean
}

export type AccordionProps = {
	className?: string
	items: AccordionContentItem[]
}
