import { ReactNode } from 'react'

interface CommandBarDialogProps {
	children: ReactNode[]
	initialIsOpen?: boolean
	onDismiss?: () => void
}

interface CommandBarDialogHeaderProps {
	children: ReactNode
}

interface CommandBarDialogBodyProps {
	children: ReactNode
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
