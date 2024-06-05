/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
import InlineSvg from '@hashicorp/react-inline-svg'
import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_SECTIONS_ORDER_BY_SLUG,
	PRODUCT_DESCRIPTIONS,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
} from './constants'
import {
	ContentTypesSection,
	CrossProductSection,
	PageHero,
	ProductSection,
} from './components'
import diamondSvg from './img/diamond-fade.svg?include'
import elipseSvg from './img/elipse-fade.svg?include'
import hexSvg from './img/hex-fade.svg?include'
import hexVertSvg from './img/hex-vert-fade.svg?include'
import s from './tutorials-landing.module.css'

// Not currently in constants because of custom placement by product
const PRODUCT_SLUGS_TO_BACKGROUND_SVGS = {
	boundary: diamondSvg,
	consul: elipseSvg,
	nomad: hexSvg,
	packer: hexVertSvg,
	terraform: hexVertSvg,
	vagrant: hexSvg,
	vault: diamondSvg,
	waypoint: hexSvg,
}

const ProductSectionBackgroundSvg = ({ productSlug, side }) => {
	return (
		<>
			<span className={s.gradientMask} />
			<InlineSvg
				className={classNames({
					[s.productSectionSvgLeft]: side === 'left',
					[s.productSectionSvgRight]: side === 'right',
					[s[`productSectionSvg--${productSlug}`]]: productSlug,
				})}
				src={PRODUCT_SLUGS_TO_BACKGROUND_SVGS[productSlug]}
			/>
		</>
	)
}

const renderProductSections = (productSlugs, pageContent) => {
	return productSlugs.map((productSlug: ProductSlug, index: number) => {
		const productName = productSlugsToNames[productSlug]
		const { certification, featuredUseCases, featuredCollections } =
			pageContent[productSlug]

		return (
			<section
				className={s.productSectionWrapper}
				key={`product-section-${productSlug}`}
			>
				<ProductSectionBackgroundSvg
					productSlug={productSlug}
					side={index % 2 === 0 ? 'right' : 'left'}
				/>
				<ProductSection
					certification={certification}
					className={s.productSection}
					featuredUseCases={featuredUseCases}
					featuredCollections={featuredCollections}
					product={{
						slug: productSlug,
						name: productName,
						description: PRODUCT_DESCRIPTIONS[productSlug],
					}}
				/>
			</section>
		)
	})
}

const TutorialsLandingView = ({ pageContent }: $TSFixMe) => {
	const { crossProductSectionCollections, ...restPageContent } = pageContent
	const [
		firstProductSlug,
		secondProductSlug,
		thirdProductSlug,
		...remainingProductSlugs
	] = PRODUCT_SECTIONS_ORDER_BY_SLUG

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				<div className={s.pageHero}>
					<PageHero subtitle={PAGE_SUBTITLE} title={PAGE_TITLE} />
				</div>
				{renderProductSections(
					[firstProductSlug, secondProductSlug, thirdProductSlug],
					restPageContent
				)}
				<section>
					<div className={s.contentTypesSectionWrapper}>
						<ContentTypesSection
							className={s.contentTypesSection}
							items={CONTENT_TYPES_SECTION_ITEMS}
							title={CONTENT_TYPES_SECTION_TITLE}
						/>
					</div>
				</section>
				{renderProductSections(remainingProductSlugs, restPageContent)}
				<section>
					<CrossProductSection
						title={BETTER_TOGETHER_SECTION_TITLE}
						collections={crossProductSectionCollections}
						className={s.crossProductSection}
					/>
				</section>
			</div>
		</BaseLayout>
	)
}

export default TutorialsLandingView
