import { ReactElement, ReactNode } from 'react'
import { BadgeProps } from 'components/badge'

interface CommandBarListItemProps {
	children: ReactNode
}

interface CommandBarListItemContentProps {
	badges?: BadgeProps['text'][]
	description?: string
	icon?: ReactElement
	title: string
}

interface CommandBarButtonListItemProps extends CommandBarListItemContentProps {
	onClick: () => void
}

interface CommandBarLinkListItemProps extends CommandBarListItemContentProps {
	url: string
}

export type {
	CommandBarButtonListItemProps,
	CommandBarLinkListItemProps,
	CommandBarListItemContentProps,
	CommandBarListItemProps,
}
