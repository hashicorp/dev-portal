/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { useCurrentProduct } from 'contexts'
import { ProductRootDocsPathLandingIconCardLinkGrid } from 'views/product-root-docs-path-landing/components'
import DocsPageHeading from 'views/docs-view/components/docs-page-heading'
import LandingHero from 'components/docs-landing-hero'
import DocsVersionSwitcher from 'components/docs-version-switcher'
import { ProductRootDocsPathLandingHeroProps } from './types'
import s from './hero.module.css'

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
				versionSelectorSlot={
					versions ? <DocsVersionSwitcher options={versions} /> : null
				}
				headingSlot={
					<LandingHero pageHeading={pageHeading} pageSubtitle={pageSubtitle} />
				}
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
