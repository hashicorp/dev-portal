import { ProductOption } from 'lib/learn-client/types'

export interface ProductTutorialsSitemapProps {
	collections: SitemapCollection[]
	product: ProductOption
}

export interface SitemapTutorial {
	id: string
	slug: string
	name: string
}

export interface SitemapCollection {
	id: string
	slug: string
	name: string
	tutorials: SitemapTutorial[]
}
