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
} from './constants'
import {
	ContentTypesSection,
	CrossProductSection,
	PageHero,
	ProductSection,
} from './components'
import s from './tutorials-landing.module.css'

const renderProductSections = (productSlugs, pageContent) => {
	return productSlugs.map((productSlug: ProductSlug) => {
		const productName = productSlugsToNames[productSlug]
		const sectionData = pageContent[productSlug]
		const certification = sectionData.certification
		const featuredUseCases = sectionData.featuredUseCases
		const featuredCollections = sectionData.featuredCollections

		return (
			<section className={s.section} key={`product-section-${productSlug}`}>
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
		<div className={s.root}>
			<div className={s.section}>
				<PageHero
					className={s.pageHero}
					subtitle={PAGE_SUBTITLE}
					title={PAGE_TITLE}
				/>
			</div>
			{renderProductSections(
				[firstProductSlug, secondProductSlug, thirdProductSlug],
				restPageContent
			)}
			<div className={s.contentTypesSectionWrapper}>
				<section className={s.section}>
					<ContentTypesSection
						className={s.contentTypesSection}
						items={CONTENT_TYPES_SECTION_ITEMS}
						title={CONTENT_TYPES_SECTION_TITLE}
					/>
				</section>
			</div>
			{renderProductSections(remainingProductSlugs, restPageContent)}
			<section className={s.section}>
				<CrossProductSection
					title={BETTER_TOGETHER_SECTION_TITLE}
					collections={crossProductSectionCollections}
					className={s.crossProductSection}
				/>
			</section>
		</div>
	)
}

TutorialsLandingView.contentType = 'tutorials'
TutorialsLandingView.layout = BaseNewLayout

export default TutorialsLandingView
