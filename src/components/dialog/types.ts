export interface DialogProps {
	children: React.ReactNode
	contentClassName?: string
	isOpen: boolean
	label?: string
	onDismiss(): void
	variant?: 'modal' | 'bottom'
}
