import {
	IconCardGridItem,
	ProductRootDocsPathLandingProps,
} from 'views/product-root-docs-path-landing/types'

export interface ProductRootDocsPathLandingHeroProps {
	pageHeading: ProductRootDocsPathLandingProps['pageHeading']
	pageSubtitle: string
	iconCardGridItems?: IconCardGridItem[]
}
