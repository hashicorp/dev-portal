type NativeButtonProps = JSX.IntrinsicElements['button']

interface TagProps {
	onRemove?: NativeButtonProps['onClick']
	text: string
	removeButtonAriaLabel?: string
}

export type { TagProps }
