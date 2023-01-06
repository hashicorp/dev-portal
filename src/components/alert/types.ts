import { ReactChild } from 'react'

export interface AlertProps {
	children: ReactChild | ReactChild[]
	type?: 'tip' | 'highlight' | 'note' | 'warning'
	title?: string
}

export type AlertData = Record<
	AlertProps['type'],
	{
		title: string
		icon: JSX.IntrinsicElements['svg']
	}
>
