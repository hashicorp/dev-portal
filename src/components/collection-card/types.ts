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
	 * Render elements in the area of the card above the heading.
	 * If omitted, will default to a count of the tutorials in the collection.
	 */
	eyebrowSlot?: ReactNode
}

export type CollectionCardPropsWithId = CollectionCardProps & {
	id: string
	dbSlug: string
}
