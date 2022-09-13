import { SUPPORTED_ICONS } from 'content/supported-icons'
import { ProductData, RootDocsPath } from 'types/products'
import { useCurrentProduct } from 'contexts'
import IconCardLink from 'components/icon-card-link'
import { IconCardGridItem } from 'views/product-root-docs-path-landing/types'
import s from './icon-card-link-grid.module.css'

interface ProductRootDocsPathLandingPageProduct extends ProductData {
	currentRootDocsPath: RootDocsPath
}

const ProductRootDocsPathLandingIconCardLinkGrid = ({
	iconCardGridItems,
}: {
	iconCardGridItems?: IconCardGridItem[]
}) => {
	const currentProduct =
		useCurrentProduct() as ProductRootDocsPathLandingPageProduct
	const items = iconCardGridItems || currentProduct.rootDocsPaths

	return (
		<ul className={s.root}>
			{items.map(
				({ iconName, path, name }: IconCardGridItem | RootDocsPath) => {
					if (currentProduct.currentRootDocsPath.path === path) {
						return null
					}

					return (
						<li key={path}>
							<IconCardLink
								icon={SUPPORTED_ICONS[iconName]}
								productSlug={currentProduct.slug}
								text={name}
								url={`/${currentProduct.slug}/${path}`}
							/>
						</li>
					)
				}
			)}
		</ul>
	)
}

export default ProductRootDocsPathLandingIconCardLinkGrid
