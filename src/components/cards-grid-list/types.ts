import { ReactNode } from 'react'

interface CardsGridListProps {
	children: ReactNode
	isOrdered?: boolean
	fixedColumns?: number
	gridGap?: '16px' | '24px'
}

export type { CardsGridListProps }
