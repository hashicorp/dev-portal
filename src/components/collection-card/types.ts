import { ReactNode } from 'react'
import { ProductOption, CompanyLogoOption } from 'lib/learn-client/types'

export { CompanyLogoOption }

export interface CollectionCardProps {
	description: string
	heading: string
	productsUsed: ProductOption[]
	tutorialCount: number
	url: string
	logo?: CompanyLogoOption

	/**
	 * TODO: add description
	 */
	eyebrowSlot?: ReactNode
}

export type CollectionCardPropsWithId = CollectionCardProps & {
	id: string
	dbSlug: string
}
