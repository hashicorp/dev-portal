// Third-party imports
import slugify from 'slugify'

// Global imports
import { useCurrentProduct } from 'contexts'
import LandingPageBlocks from 'components/landing-page-blocks'

// Local imports
import s from './marketing-content.module.css'

const GETTING_STARTED_CARD_HEADING = 'Getting Started'
const GETTING_STARTED_CARD_HEADING_SLUG = slugify(GETTING_STARTED_CARD_HEADING)

const ProductRootDocsPathLandingMarketingContent = ({ blocks }) => {
	const currentProduct = useCurrentProduct()

	return (
		<div className={s.root}>
			{blocks.map((block, index) => {
				if (block.type === 'paragraph') {
					return <LandingPageBlocks.ParagraphBlock {...block} key={index} />
				}

				if (block.type === 'section-heading') {
					return (
						<LandingPageBlocks.SectionHeadingBlock
							id={block.headingId}
							level={block.headingLevel}
							text={block.title}
							key={index}
						/>
					)
				}

				if (block.type === 'icon-card-grid') {
					return (
						<LandingPageBlocks.IconCardGridBlock
							cards={block.cards}
							productSlug={currentProduct.slug}
							key={index}
						/>
					)
				}

				if (block.type === 'card-grid') {
					return (
						<LandingPageBlocks.CardGridBlock
							cards={block.cards}
							description={block.description}
							headingLevel={block.headingLevel}
							headingId={block.headingId}
							title={block.title}
							key={index}
						/>
					)
				}

				if (block.type === 'getting-started-card') {
					return (
						<LandingPageBlocks.CalloutCardBlock
							body={block.description}
							ctas={[block.callToAction]}
							heading={GETTING_STARTED_CARD_HEADING}
							headingSlug={GETTING_STARTED_CARD_HEADING_SLUG}
							key={index}
						/>
					)
				}
			})}
		</div>
	)
}

export { GETTING_STARTED_CARD_HEADING, GETTING_STARTED_CARD_HEADING_SLUG }
export default ProductRootDocsPathLandingMarketingContent
