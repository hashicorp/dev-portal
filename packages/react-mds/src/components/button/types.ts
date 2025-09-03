import { COLORS } from './utils'
import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'

export type Size = 'medium' | 'small'
export type ThemeBackground = 'light' | 'dark' | 'brand'
export interface Theme {
	variant?: ThemeVariant
	background?: ThemeBackground
	brand?: HashiCorpProduct | 'neutral'
}
export type LinkType = 'inbound' | 'outbound' | 'anchor' | 'download'
export type ThemeVariant =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'tertiary-neutral'
	| 'ghost'
export type ButtonColor = (typeof COLORS)[number]

export interface ButtonBaseProps {
	url?: string
	href?: string
	label?: string
	className?: string
	external?: boolean
	onClick?:
		| React.MouseEventHandler<HTMLButtonElement>
		| React.MouseEventHandler<HTMLAnchorElement>
	size?: Size
	linkType?: LinkType
	disabled?: boolean
	icon?: string
	iconPosition?: 'leading' | 'trailing'
	theme?: Theme
	type?: 'button' | 'submit' | 'reset'
	locale?: string
}

export type ButtonProps =
	| (ButtonBaseProps & { title: string; text?: string })
	| (ButtonBaseProps & { title?: undefined; text: string })
