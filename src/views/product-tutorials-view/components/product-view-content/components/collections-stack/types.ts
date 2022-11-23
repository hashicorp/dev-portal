import { CollectionCardPropsWithId } from 'components/collection-card'
import { ProductOption } from 'lib/learn-client/types'

export interface CollectionsStackProps {
	/** Heading to show above the collection cards. */
	heading?: string
	/**
	 * Identifier for the heading, which should unique in the context of the page.
	 * Note: headingSlug is added after fetching content from the Learn API
	 */
	headingSlug?: string
	/** Subheading to show above the collection cards. */
	subheading?: string
	/** A product slug, used for theming */
	product: ProductOption
	collectionCards?: CollectionCardPropsWithId[]
}
