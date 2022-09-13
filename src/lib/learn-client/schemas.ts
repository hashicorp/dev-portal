import Joi from 'joi'

import { ProductOption, ThemeOption } from './types'

/**
 * These schemas are used in testing to fully validate
 * the shape returned from client functions
 */

// Page
// (specifically product pages, which are the only type of page we have so far)

const BrandedCalloutBlockSchema = Joi.object({
	type: Joi.string().required().valid('BrandedCallout'),
	product: Joi.string().valid(...Object.values(ProductOption)),
	heading: Joi.string().required(),
	subheading: Joi.string(),
	cta: Joi.object({
		text: Joi.string().required(),
		url: Joi.string().required(),
	}),
})

const LogoCardBlockSchema = Joi.object({
	type: Joi.string().required().valid('LogoCard'),
	logo: Joi.string()
		.valid(
			'docker',
			'github',
			'microsoft-azure',
			'oci',
			'google-cloud',
			'terraform-cloud',
			'aws'
		)
		.required(),
	collectionSlug: Joi.string().required(),
})

const CardListBlockSchema = Joi.object({
	items: Joi.array().items(LogoCardBlockSchema).required().min(1),
})

const TutorialsStackBlockSchema = Joi.object({
	type: Joi.string().required().valid('TutorialsStack'),
	product: Joi.string().valid(...Object.values(ProductOption)),
	heading: Joi.string(),
	subheading: Joi.string(),
	tutorialSlugs: Joi.array().items(Joi.string()).required().min(1),
})

const CollectionsStackBlockSchema = Joi.object({
	type: Joi.string().required().valid('CollectionsStack'),
	product: Joi.string().valid(...Object.values(ProductOption)),
	heading: Joi.string(),
	subheading: Joi.string(),
	collectionSlugs: Joi.array().items(Joi.string()).required().min(1),
})

const FeaturedStackBlockSchema = Joi.object({
	type: Joi.string().required().valid('FeaturedStack'),
	heading: Joi.string().required(),
	subheading: Joi.string(),
	// Note that FeaturedStackBlocks can only contain CardList blocks, for now.
	// We may want to switch to using "heading" & "subheading" blocks, rather
	// that this approach, which requires nesting arrays of blocks instead
	// having a single flat array (with the benefit of more controlled
	// styling of headings & subheadings in specific contexts).
	blocks: Joi.array()
		.items(
			Joi.object({
				type: Joi.string().required().valid('CardList'),
			}).when(Joi.object({ type: 'CardList' }).unknown(), {
				then: CardListBlockSchema,
			})
		)
		.required()
		.min(1),
})

export const ProductPageSchema = Joi.object({
	slug: Joi.string()
		.valid(
			...Object.values(ProductOption),
			ThemeOption.cloud,
			'well-architected-framework'
		)
		.required(),
	pageData: Joi.object({
		title: Joi.string(),
		description: Joi.string(),
		blocks: Joi.array()
			.items(
				Joi.object({
					type: Joi.string()
						.required()
						.valid(
							'BrandedCallout',
							'CardList',
							'CollectionsStack',
							'FeaturedStack',
							'TutorialsStack'
						),
				})
					.when(Joi.object({ type: 'BrandedCallout' }).unknown(), {
						then: BrandedCalloutBlockSchema,
					})
					.when(Joi.object({ type: 'CardList' }).unknown(), {
						then: CardListBlockSchema,
					})
					.when(Joi.object({ type: 'CollectionsStack' }).unknown(), {
						then: CollectionsStackBlockSchema,
					})
					.when(Joi.object({ type: 'FeaturedStack' }).unknown(), {
						then: FeaturedStackBlockSchema,
					})
					.when(Joi.object({ type: 'TutorialsStack' }).unknown(), {
						then: TutorialsStackBlockSchema,
					})
			)
			.required(),
		showProductSitemap: Joi.boolean(),
		docsCta: Joi.object({
			heading: Joi.string().required(),
			subheading: Joi.string().required(),
			links: Joi.array().items(
				Joi.object({
					title: Joi.string(),
					url: Joi.string(),
				})
			),
		}),
	}).required(),
})
