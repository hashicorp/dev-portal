import { ReactNode } from 'react'

interface BaseProps {
	children: ReactNode
}

type WithLabelProps =
	| {
			ariaLabelledBy?: never
			label: string
	  }
	| {
			ariaLabelledBy: string
			label?: never
	  }

type CommandBarListProps = BaseProps & WithLabelProps

export type { CommandBarListProps }
