type NativeButtonProps = JSX.IntrinsicElements['button']

interface TagProps {
	onRemove?: NativeButtonProps['onClick']
	text: string
	buttonAriaLabel?: string
}

export type { TagProps }
