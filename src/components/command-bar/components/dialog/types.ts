interface CommandBarDialogProps {
	isOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogFooterProps {
	instructionsElementId: string
}

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
