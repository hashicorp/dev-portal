import { ProductSlug } from 'types/products'
import { ReactNode } from 'react'

export interface BrandedCardProps {
	children: ReactNode
	productSlug?: ProductSlug
}
