import { ReactChild } from 'react'

export interface InlineAlertProps {
	color?: 'neutral' | 'highlight' | 'warning' | 'critical'
	description: ReactChild | ReactChild[]
	icon?: JSX.IntrinsicElements['svg']
	title: string
}
