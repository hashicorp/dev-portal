import { ProductSlug } from 'types/products'
import { productSlugsToNames } from 'lib/products'
import BaseNewLayout from 'layouts/base-new'
import {
	PAGE_TITLE,
	PAGE_SUBTITLE,
	PRODUCT_SECTIONS_ORDER_BY_SLUG,
	PRODUCT_DESCRIPTIONS,
	CONTENT_TYPES_SECTION_TITLE,
	CONTENT_TYPES_SECTION_ITEMS,
	BETTER_TOGETHER_SECTION_TITLE,
	BETTER_TOGETHER_SECTION_COLLECTION_SLUGS,
} from './constants'
import { ContentTypesSection, PageHero, ProductSection } from './components'
import s from './tutorials-landing.module.css'

const renderProductSections = (productSlugs, pageContent) => {
	return productSlugs.map((productSlug: ProductSlug) => {
		const productName = productSlugsToNames[productSlug]
		const sectionData = pageContent[productSlug]
		const certification = sectionData.certification
		const featuredUseCases = sectionData.featuredUseCases
		const featuredCollections = sectionData.featuredCollections

		return (
			<ProductSection
				key={`product-section-${productSlug}`}
				certification={certification}
				featuredUseCases={featuredUseCases}
				featuredCollections={featuredCollections}
				product={{
					slug: productSlug,
					name: productName,
					description: PRODUCT_DESCRIPTIONS[productSlug],
				}}
			/>
		)
	})
}

const BetterTogetherSection = () => {
	return (
		<section className={s.betterTogetherSection}>
			<h2
				style={{
					fontSize: '1.875rem',
					fontWeight: 700,
					lineHeight: '1.3',
					maxWidth: '40%',
					marginBottom: 36,
				}}
			>
				{BETTER_TOGETHER_SECTION_TITLE}
			</h2>
			<ul
				style={{
					margin: 0,
					padding: 0,
					display: 'flex',
					gap: 22,
					alignItems: 'flex-start',
					listStyle: 'none',
				}}
			>
				{BETTER_TOGETHER_SECTION_COLLECTION_SLUGS.map((collectionSlug) => {
					return (
						<li
							key={collectionSlug}
							style={{
								backgroundColor: '#DBDBDC',
								border: '1px solid magenta',
								width: 400,
								height: 300,
								borderRadius: 10,
								padding: 24,
							}}
						>
							{collectionSlug}
						</li>
					)
				})}
			</ul>
		</section>
	)
}

const TutorialsLandingView = ({ pageContent }: $TSFixMe) => {
	const [
		firstProductSlug,
		secondProductSlug,
		thirdProductSlug,
		...remainingProductSlugs
	] = PRODUCT_SECTIONS_ORDER_BY_SLUG

	return (
		<div className={s.root}>
			<PageHero
				className={s.pageHero}
				subtitle={PAGE_SUBTITLE}
				title={PAGE_TITLE}
			/>
			{renderProductSections(
				[firstProductSlug, secondProductSlug, thirdProductSlug],
				pageContent
			)}
			<ContentTypesSection
				items={CONTENT_TYPES_SECTION_ITEMS}
				title={CONTENT_TYPES_SECTION_TITLE}
			/>
			{renderProductSections(remainingProductSlugs, pageContent)}
			<BetterTogetherSection />
		</div>
	)
}

TutorialsLandingView.contentType = 'tutorials'
TutorialsLandingView.layout = BaseNewLayout

export default TutorialsLandingView
