// Third-party imports
import classNames from 'classnames'
import slugify from 'slugify'

// Global imports
import { SUPPORTED_ICONS } from 'content/supported-icons'
import { useCurrentProduct } from 'contexts'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import CalloutCard from 'components/callout-card'
import Heading, { HeadingProps } from 'components/heading'
import IconCardLinkGridList from 'components/icon-card-link-grid-list'
import Text from 'components/text'
import TruncateMaxLines from 'components/truncate-max-lines'

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
							<Text
								className={s.cardGridCardTitle}
								size={200}
								weight="semibold"
							>
								{title}
							</Text>
							<Text
								className={s.cardGridCardDescription}
								size={100}
								weight="regular"
							>
								<TruncateMaxLines
									maxLines={3}
									lineHeight="var(--token-typography-body-100-line-height)"
								>
									{description}
								</TruncateMaxLines>
							</Text>
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
			{blocks.map((block) => {
				if (block.type === 'paragraph') {
					return <ParagraphBlock {...block} />
				}

				if (block.type === 'section-heading') {
					return (
						<SectionHeading
							id={block.headingId}
							level={block.headingLevel}
							text={block.title}
						/>
					)
				}

				if (block.type === 'icon-card-grid') {
					return (
						<IconCardGrid
							cards={block.cards}
							productSlug={currentProduct.slug}
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
						/>
					)
				}
			})}
		</div>
	)
}

export { GETTING_STARTED_CARD_HEADING, GETTING_STARTED_CARD_HEADING_SLUG }
export default ProductRootDocsPathLandingMarketingContent
