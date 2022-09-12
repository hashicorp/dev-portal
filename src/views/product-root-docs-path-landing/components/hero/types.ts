import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { ProductRootDocsPathLandingProps } from 'views/product-root-docs-path-landing/types'

export interface ProductRootDocsPathLandingHeroProps {
	pageHeading: ProductRootDocsPathLandingProps['pageHeading']
	pageSubtitle: string
	versions?: VersionSelectItem[]
}
