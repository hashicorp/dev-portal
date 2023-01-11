import { InlineAlertProps } from 'components/inline-alert'

export interface MdxInlineAlertProps {
	children: InlineAlertProps['description']
	title?: string
	type?: 'tip' | 'highlight' | 'note' | 'warning'
}

export type MdxInlineAlertData = Record<
	MdxInlineAlertProps['type'],
	{
		title: string
		icon: JSX.IntrinsicElements['svg']
		color: InlineAlertProps['color']
	}
>
