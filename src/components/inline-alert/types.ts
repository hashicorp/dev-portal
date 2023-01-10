import { ReactChild } from 'react'

export interface InlineAlertProps {
	children: ReactChild | ReactChild[]
	type?: 'tip' | 'highlight' | 'note' | 'warning'
	title?: string
}

export type InlineAlertData = Record<
	InlineAlertProps['type'],
	{
		title: string
		icon: JSX.IntrinsicElements['svg']
	}
>
