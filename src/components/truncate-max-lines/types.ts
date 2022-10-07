import type { ReactNode } from 'react'

export interface TruncateMaxLinesProps {
	children: ReactNode
	className?: string
	lineHeight: string
	maxLines: number
}
