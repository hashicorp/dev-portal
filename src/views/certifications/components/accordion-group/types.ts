import { ReactNode } from 'react'

export interface AccordionItem {
	title: string
	content: ReactNode
}

export interface AccordionGroupProps {
	items: AccordionItem[]
}
