import { ReactNode } from 'react'

export interface CardProps {
	children: ReactNode
	className?: string
	elevation?: 'base' | 'low' | 'mid' | 'high'
}
