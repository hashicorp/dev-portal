import { ReactNode } from 'react'

interface CommandBarDialogProps {
	children: ReactNode[]
	isOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogHeaderProps {
	className?: string
}

interface CommandBarDialogBodyProps {
	className?: string
}

interface CommandBarDialogFooterProps {
	children: ReactNode
}

export type {
	CommandBarDialogBodyProps,
	CommandBarDialogFooterProps,
	CommandBarDialogHeaderProps,
	CommandBarDialogProps,
}
