import { DialogProps as ReachDialogProps } from '@reach/dialog'

export interface DialogProps {
	ariaDescribedBy?: string
	children: React.ReactNode
	contentClassName?: string
	isOpen: boolean
	label: string
	onDismiss: ReachDialogProps['onDismiss']
	variant?: 'modal' | 'bottom'
}
