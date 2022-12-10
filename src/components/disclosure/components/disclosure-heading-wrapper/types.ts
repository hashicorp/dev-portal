import { ReactNode } from 'react'

export type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type DisclosureHeadingWrapperProps = {
	children: ReactNode
	level?: HeadingLevel
}
