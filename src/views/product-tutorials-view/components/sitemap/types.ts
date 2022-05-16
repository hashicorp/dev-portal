import { ProductOption } from 'lib/learn-client/types'

export interface ProductTutorialsSitemapProps {
  collections: SitemapCollection[]
  product: ProductOption
}

type SitemapItem = {
  slug: string
  name: string
}

interface SitemapCollection extends SitemapItem {
  tutorials: SitemapItem[]
}
