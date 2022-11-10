import { ProductOption } from 'lib/learn-client/types'

export interface ProductTutorialsSitemapProps {
	collections: SitemapCollection[]
	product: ProductOption
}

export interface SitemapItem {
	id: string
	slug: string
	name: string
}

export interface SitemapCollection extends SitemapItem {
	tutorials: SitemapItem[]
}
