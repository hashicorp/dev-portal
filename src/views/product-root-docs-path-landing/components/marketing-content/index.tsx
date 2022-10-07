// Third-party imports
import classNames from 'classnames'
import slugify from 'slugify'

// Global imports
import { SUPPORTED_ICONS } from 'content/supported-icons'
import { useCurrentProduct } from 'contexts'
import CalloutCard from 'components/callout-card'
import { CardDescription, CardTitle } from 'components/card/components'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import Heading, { HeadingProps } from 'components/heading'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import Text from 'components/text'

// Local imports
import s from './marketing-content.module.css'
import { ParagraphBlock } from '../paragraph-block'

const GETTING_STARTED_CARD_HEADING = 'Getting Started'
const GETTING_STARTED_CARD_HEADING_SLUG = slugify(GETTING_STARTED_CARD_HEADING)

/**
 * @TODO move to a different folder/file & document
 * @TODO make Heading have default size instead of this abstraction?
 */
const AutosizedHeading = ({
	className,
	id,
	level,
	text,
}: {
	className?: string
	id: string
	level: 2 | 3
	text: string
}) => {
	const levelsToSize = {
		2: 400,
		3: 300,
	}
	const classes = classNames(s.heading, s[`h${level}`], className)

	return (
		<Heading
			className={classes}
			id={id}
			level={level}
			size={levelsToSize[level] as HeadingProps['size']}
			weight="bold"
		>
			{text}
		</Heading>
	)
}

/**
 * @TODO move to a different folder/file & document
 */
const SectionHeading = ({ level, id, text }) => {
	return (
		<AutosizedHeading
			className={s.sectionHeading}
			id={id}
			level={level}
			text={text}
		/>
	)
}

/**
 * @TODO move to a different folder/file & document
 */
const IconCardGrid = ({ cards, productSlug }) => {
	return (
		<IconCardLinkGridList
			cards={cards.map(({ iconName, text, url }) => ({
				icon: SUPPORTED_ICONS[iconName],
				text,
				url,
			}))}
			productSlug={productSlug}
		/>
	)
}

/**
 * @TODO move to a different folder/file & document
 */
const CardGrid = ({ cards, description, title, headingId, headingLevel }) => {
	const hasTitle = Boolean(title)
	const hasDescription = Boolean(description)

	return (
		<div className={s.cardGridWrapper}>
			{hasTitle && (
				<AutosizedHeading level={headingLevel} id={headingId} text={title} />
			)}
			{hasDescription && (
				<Text className={s.cardGridDescription} size={300} weight="regular">
					{description}
				</Text>
			)}
			<CardsGridList>
				{cards.map(({ description, title, url }) => (
					<li key={url}>
						<CardLink ariaLabel={title} className={s.cardGridCard} href={url}>
							<CardTitle text={title} />
							<CardDescription text={description} />
						</CardLink>
					</li>
				))}
			</CardsGridList>
		</div>
	)
}

const ProductRootDocsPathLandingMarketingContent = ({ blocks }) => {
	const currentProduct = useCurrentProduct()

	return (
		<div className={s.root}>
			{blocks.map((block, index) => {
				if (block.type === 'paragraph') {
					return <ParagraphBlock {...block} key={index} />
				}

				if (block.type === 'section-heading') {
					return (
						<SectionHeading
							id={block.headingId}
							level={block.headingLevel}
							text={block.title}
							key={index}
						/>
					)
				}

				if (block.type === 'icon-card-grid') {
					return (
						<IconCardGrid
							cards={block.cards}
							productSlug={currentProduct.slug}
							key={index}
						/>
					)
				}

				if (block.type === 'card-grid') {
					return (
						<CardGrid
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
						<CalloutCard
							heading={GETTING_STARTED_CARD_HEADING}
							headingSlug={GETTING_STARTED_CARD_HEADING_SLUG}
							body={block.description}
							ctas={[block.callToAction]}
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
