import { ReactNode } from 'react'

interface CommandBarDialogProps {
	children: ReactNode[]
	isOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogFooterProps {
	children: ReactNode
}

export type { CommandBarDialogFooterProps, CommandBarDialogProps }
