// Components
// Types
import type { ProductSlug } from 'types/products'

type AlgoliaContentType = 'docs' | 'tutorial' | 'integration'

export interface UnifiedHitProps {
	type: AlgoliaContentType
	href: string
	ariaLabel: string
	titleHtml: string
	descriptionHtml: string
	productSlug: ProductSlug
	productName: string
}
