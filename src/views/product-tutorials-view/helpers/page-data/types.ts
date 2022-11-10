import {
	InlineCollections,
	InlineTutorials,
} from '../../helpers/get-inline-content'
import { ProductViewBlock } from '../../components/product-view-content'
import { ProductTutorialsSitemapProps } from '../../components/sitemap/types'

export interface ProductPageData {
	pageData: {
		blocks: ProductViewBlock[]
		showProductSitemap?: boolean
	}
	sitemapCollections: ProductTutorialsSitemapProps['collections']
	inlineCollections: InlineCollections
	inlineTutorials: InlineTutorials
}
