type NativeButtonProps = JSX.IntrinsicElements['button']

interface TagProps {
	onRemove?: NativeButtonProps['onClick']
	text: string
}

export type { TagProps }
