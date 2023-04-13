/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCurrentProduct } from 'contexts'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'
import DocsPageHeading from 'views/docs-view/components/docs-page-heading'

const ProductRootDocsPathLandingHero = ({
	pageHeading,
	pageSubtitle,
	iconCardGridItems,
	versions,
}: ProductRootDocsPathLandingHeroProps) => {
	const currentProduct = useCurrentProduct()

	return (
		<header>
			<DocsPageHeading
				asLandingHero
				pageHeading={pageHeading}
				subtitle={pageSubtitle}
				versions={versions}
			/>
			{currentProduct.slug !== 'terraform' ? (
				<div className={s.iconCardGridLink}>
					<ProductRootDocsPathLandingIconCardLinkGrid
						iconCardGridItems={iconCardGridItems}
					/>
				</div>
			) : null}
		</header>
	)
}

export default ProductRootDocsPathLandingHero
