export interface DialogProps {
	ariaDescribedBy?: string
	children: React.ReactNode
	contentClassName?: string
	isOpen: boolean
	label: string
	onDismiss(): void
	variant?: 'modal' | 'bottom'
}
