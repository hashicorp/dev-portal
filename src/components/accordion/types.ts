import { ReactNode } from 'react'

export type AccordionContentItem = {
	title: string
	content: ReactNode
}

export type AccordionProps = {
	className?: string
	items: AccordionContentItem[]
}
