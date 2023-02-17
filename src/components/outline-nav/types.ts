/**
 * Individual outline links
 */
export interface OutlineLinkProps {
	title: string
	url: string
	isActive?: boolean
}

/**
 * Individual outline links with nested items.
 */
export interface OutlineLinkWithNestingProps extends OutlineLinkProps {
	items: OutlineLinkItem[]
}

/**
 * Mixed type for basic or nested items.
 */
export type OutlineLinkItem = OutlineLinkProps | OutlineLinkWithNestingProps

/**
 * Prop types for the presentational component.
 */
export interface OutlineNavProps {
	items: OutlineLinkItem[]
}

/**
 * Heading type, for compatibility with existing conventions.
 */
export interface OutlineHeading {
	title: string
	slug: string
	level: 1 | 2 | 3 | 4 | 5 | 6
}
