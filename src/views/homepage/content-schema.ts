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
 * Hero
 */
interface HeroContent {
	heading: string
	description: string
}
const heroSchema = Joi.object({
	heading: Joi.string().required(),
	description: Joi.string().required(),
})

/**
 * Merchandising
 */
interface MerchandisingContent {
	vault: {
		cardTitle: string
		url: string
		description: string
		ctaText: string
	}
	hcp: {
		cardTitle: string
		url: string
		description: string
		ctaText: string
	}
}
const merchandisingSchema = Joi.object({
	vault: Joi.object({
		cardTitle: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		ctaText: Joi.string().required(),
	}).required(),
	hcp: Joi.object({
		cardTitle: Joi.string().required(),
		url: Joi.string().required(),
		description: Joi.string().required(),
		ctaText: Joi.string().required(),
	}).required(),
})

/**
 * Learn section
 */
interface CertificationsSectionContent {
	heading: string
	description: string
	link: {
		url: string
		text: string
	}
	collectionSlugs: string[]
}
const certificationsSectionSchema = Joi.object({
	heading: Joi.string().required(),
	description: Joi.string().required(),
	link: Joi.object({
		url: Joi.string().required(),
		text: Joi.string().required(),
	}).required(),
	collectionSlugs: Joi.array().items(Joi.string()).required().min(1),
})

/**
 * Pre Footer
 */
interface PreFooterContent {
	heading: string
	description: string
	actions: {
		icon: 'support' | 'help' | 'user'
		heading: string
		description: string
		link: string
	}[]
}
const preFooterSchema = Joi.object({
	heading: Joi.string().required(),
	description: Joi.string().required(),
	actions: Joi.array()
		.items(
			Joi.object({
				icon: Joi.string().required().valid('support', 'help', 'user'),
				heading: Joi.string().required(),
				description: Joi.string().required(),
				link: Joi.string().required(),
			})
		)
		.required()
		.min(1),
})

/**
 * Authored content type for home page
 */
export interface HomePageAuthoredContent {
	/** Hero text content. Video is managed in JSX. */
	hero: HeroContent
	/** Optional notice displayed above the product switcher. */
	navNotice?: string
	/** Pre-set Vault and HashiConf merchandising slots. */
	merchandising: MerchandisingContent
	/** CertificationsSection. */
	certificationsSection: CertificationsSectionContent
	/** Copy settings for pre-footer content.  */
	preFooter: PreFooterContent
}

/**
 * Authored content schema for home page
 */
export const HomePageAuthoredContentSchema = Joi.object({
	hero: heroSchema.required(),
	navNotice: Joi.string(),
	merchandising: merchandisingSchema.required(),
	certificationsSection: certificationsSectionSchema.required(),
	preFooter: preFooterSchema.required(),
})
