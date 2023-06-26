import type { ProductSlug } from 'types/products'
import type { UnifiedSearchableContentType } from '../../types'

export interface UnifiedHitProps {
	type: Exclude<UnifiedSearchableContentType, 'global'>
	href: string
	ariaLabel: string
	titleHtml: string
	descriptionHtml: string
	productSlug: ProductSlug
	productName: string
}
