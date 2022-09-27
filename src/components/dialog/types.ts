export interface DialogProps {
	children: React.ReactNode
	contentWrapperClassName?: string
	contentClassName?: string
	isOpen: boolean
	label?: string
	onDismiss(): void
	variant?: 'modal' | 'bottom'
}
