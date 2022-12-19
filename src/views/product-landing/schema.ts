import { CalloutCardProps } from 'components/callout-card/types'
import Joi from 'joi'

/**
 * This schema is used to validate the content for product landing pages.
 * Validating our JSON content ensures that the content data type is accurate.
 *
 * The ProductLandingContent interface
 * should match the Joi schema one-to-one.
 * For this reason, the interface and schema are co-located here.
 */

/**
 *
 * Content Block Types & Schemas
 * (full type & schema follows)
 *
 */

/**
 * Callout
 */

interface CalloutContentBlock extends CalloutCardProps {
	type: 'callout'
}

const CalloutContentBlockSchema = Joi.object({
	type: Joi.string().required().valid('callout'),
	heading: Joi.string().required(),
	body: Joi.string().required(),
	iconCardLinks: Joi.array().items(
		Joi.object({
			icon: Joi.string().required(),
			text: Joi.string().required(),
			url: Joi.string().required(),
		})
	),
	ctas: Joi.array()
		.items(
			Joi.object({
				text: Joi.string().required(),
				url: Joi.string().required(),
			})
		)
		.min(1),
	fixedColumns: Joi.number(),
})

/**
 * Heading
 */
interface HeadingContentBlock {
	type: 'heading'
	heading: string
	level: 2 /* todo, remove this from content authoring */
	size: 400 /* todo, remove this from content authoring */
}
const HeadingContentBlockSchema = Joi.object({
	type: Joi.string().required().valid('heading'),
	heading: Joi.string().required(),
	level: Joi.number().required().valid(2),
	size: Joi.number().required().valid(400),
})

/**
 * TutorialCards
 */
interface TutorialCardsContentBlock {
	type: 'tutorial_cards'
	tutorialSlugs: string[]
}
const TutorialCardsContentBlockSchema = Joi.object({
	type: Joi.string().required().valid('tutorial_cards'),
	tutorialSlugs: Joi.array().items(Joi.string()).required().min(1),
})

/**
 * CollectionCards
 */
interface CollectionCardsContentBlock {
	type: 'collection_cards'
	collectionSlugs: string[]
}
const CollectionCardsContentBlockSchema = Joi.object({
	type: Joi.string().required().valid('collection_cards'),
	collectionSlugs: Joi.array().items(Joi.string()).required().min(1),
})

/**
 * LinkedCards
 */
interface LinkedCardsContentBlock {
	type: 'linked_cards'
	cards: {
		heading: string
		body: string
		url: string
	}[]
}
const LinkedCardsContentBlockSchema = Joi.object({
	type: Joi.string().required().valid('linked_cards'),
	cards: Joi.array()
		.items(
			Joi.object({
				heading: Joi.string().required(),
				body: Joi.string().required(),
				url: Joi.string().required(),
			})
		)
		.required()
		.min(1),
})

/**
 *
 * Full content type & schema
 * (uses content block types & schemas above)
 *
 */

export interface ProductLandingContent {
	hero: {
		heading: string
		image: string
	}
	overview: {
		heading: string
		body: string
		cta?: {
			text: string
			url: string
		}
		image: string
	}
	overviewParagraph?: string
	get_started: {
		heading: string
		body: string
		ctas: {
			text: string
			url: string
		}[]
	}
	blocks: ProductLandingContentBlock[]
}

const ProductLandingHeroSchema = Joi.object({
	heading: Joi.string().required(),
	image: Joi.string().required(),
}).required()

const ProductLandingOverviewSchema = Joi.object({
	heading: Joi.string().required(),
	body: Joi.string().required(),
	cta: Joi.object({
		text: Joi.string().required(),
		url: Joi.string().required(),
	}),
	image: Joi.string().required(),
})

// Require either `ctas` or `iconCardLinks`
const ProductLandingGetStartedSchema = Joi.alternatives().try(
	Joi.object({
		heading: Joi.string().required(),
		body: Joi.string().required(),
		fixedColumns: Joi.number(),
		ctas: Joi.array()
			.items(
				Joi.object({
					text: Joi.string().required(),
					url: Joi.string().required(),
				})
			)
			.required()
			.min(1),
	}),
	Joi.object({
		heading: Joi.string().required(),
		body: Joi.string().required(),
		iconCardLinks: Joi.array()
			.items(
				Joi.object({
					icon: Joi.string().required(),
					text: Joi.string().required(),
					url: Joi.string().required(),
				})
			)
			.required(),
		fixedColumns: Joi.number(),
	})
)

/**
 * Roll up of all block types
 */
export type ProductLandingContentBlock =
	| HeadingContentBlock
	| TutorialCardsContentBlock
	| CollectionCardsContentBlock
	| LinkedCardsContentBlock
	| CalloutContentBlock
const ProductLandingContentBlockSchema = Joi.object({
	type: Joi.string()
		.required()
		.valid('heading', 'tutorial_cards', 'linked_cards'),
})
	.when(Joi.object({ type: 'callout' }).unknown(), {
		then: CalloutContentBlockSchema,
	})
	.when(Joi.object({ type: 'heading' }).unknown(), {
		then: HeadingContentBlockSchema,
	})
	.when(Joi.object({ type: 'tutorial_cards' }).unknown(), {
		then: TutorialCardsContentBlockSchema,
	})
	.when(Joi.object({ type: 'collection_cards' }).unknown(), {
		then: CollectionCardsContentBlockSchema,
	})
	.when(Joi.object({ type: 'linked_cards' }).unknown(), {
		then: LinkedCardsContentBlockSchema,
	})

export const ProductLandingContentSchema = Joi.object({
	hero: ProductLandingHeroSchema,
	overview: ProductLandingOverviewSchema,
	overviewParagraph: Joi.string(),
	get_started: ProductLandingGetStartedSchema,
	blocks: Joi.array().items(ProductLandingContentBlockSchema),
})
