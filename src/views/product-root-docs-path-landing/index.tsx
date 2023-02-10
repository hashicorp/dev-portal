import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import LandingPageBlocks from 'components/landing-page-blocks'
import { ProductRootDocsPathLandingProps } from './types'
import { ProductRootDocsPathLandingHero } from './components'

const ProductRootDocsPathLanding = ({
	pageContent,
	pageHeading,
	product,
}: ProductRootDocsPathLandingProps) => {
	const { pageSubtitle, marketingContentBlocks } = pageContent

	return (
		<div>
			<ProductRootDocsPathLandingHero
				pageHeading={pageHeading}
				pageSubtitle={pageSubtitle}
				iconCardGridItems={pageContent.iconCardGridItems}
			/>
			<LandingPageBlocks
				blocks={marketingContentBlocks.map((block) => {
					const { type } = block
					if (type === 'icon-card-grid') {
						const { type, title, cards } = block
						return {
							type,
							title,
							cards,
							productSlug: product.slug,
						}
					}
					return block
				})}
			/>
		</div>
	)
}

ProductRootDocsPathLanding.contentType = 'docs'
ProductRootDocsPathLanding.layout = SidebarSidecarLayout

export type { ProductRootDocsPathLandingProps }
export default ProductRootDocsPathLanding
