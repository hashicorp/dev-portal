import { ReactNode } from 'react'

interface CommandBarDialogProps {
	isOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogFooterProps {
	children: ReactNode
}

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
