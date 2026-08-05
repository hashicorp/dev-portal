/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'

/**
 * We support a limited set of product slugs for Certification exam purposes.
 *
 * Product slugs are mainly used to render themed certification badges.
 * This schema, and components that use the CertificationProductSlug type,
 * will need to be expanded when additional certification programs are added.
 */
export const productsWithCertifications = ['terraform', 'vault'] as const

const CertificationProductSlugSchema = z.enum(productsWithCertifications)

/**
 * Export the CertificationProductSlug enum as a type.
 */
export type CertificationProductSlug = z.infer<
	typeof CertificationProductSlugSchema
>

/**
 * Each exam can optionally define a tier.
 * - associate (shows 1 start on badges)
 * - pro (shows 2 stars on badges)
 * Generally, the `associate` tier is used as the default.
 */
const ExamTierSchema = z.enum(['associate', 'pro'])

/**
 * Export the ExamTier enum as a type.
 */
export type ExamTier = z.infer<typeof ExamTierSchema>

/**
 * Content schema for an exam page.
 *
 * Each certification program can reference multiple exams.
 * For example, the Security Automation certification program
 * contains both the Vault Associate and Vault Professional exams.
 */
const MdxRemoteSerializeResultSchema = z.object({
	compiledSource: z.string(),
	scope: z.record(z.string(), z.unknown()),
})

const FaqItemSchema = z.object({
	title: z.string(),
	mdxSource: MdxRemoteSerializeResultSchema,
})

export const ExamPageContentSchema = z.object({
	objectivesItems: z.array(FaqItemSchema),
	recertificationMdx: MdxRemoteSerializeResultSchema,
})

const ctaSchema = z.object({
	text: z.string(),
	link: z.string(),
})

const whoShouldTakeExamSchema = z.object({
	title: z.string().optional(),
	description: z.string(),
})

const prerequisitesSchema = z.object({
	title: z.string().optional(),
	prereqs: z.array(z.string()),
	bottomDescription: z.string().optional(),
})

const examDetailSchema = z.object({
	name: z.string(),
	value: z.string(),
})

const examDetailsSchema = z.object({
	title: z.string().optional(),
	details: z.array(examDetailSchema),
})

const certificationCardSchema = z.object({
	product: z.string(),
	title: z.string(),
	description: z.string().optional(),
	starCount: z.number().optional(),
	cta: z.string().optional(),
	ctaLink: z.string(),
	certDetails: z.array(z.string()).optional(),
	isReduced: z.boolean().optional(),
})

const relatedCertsTempSchema = certificationCardSchema

const relatedCertsExamSchema = z.object({
	examUUID: z.string(),
})

/**
 * Content schema for an individual certification program.
 *
 * Certification programs are oriented around solution areas, such as
 * "Infrastructure Automation". Each certification program can contain
 * multiple specific exams.
 */
export const CertificationProgramSchema = z.object({
	title: z.string(),
	hero: z.object({
		eyebrow: z.string().optional(),
		title: z.string(),
		description: z.string(),
		leftCta: ctaSchema.optional(),
		rightCta: ctaSchema.optional(),
	}),
	announcement: z.object({
		header: z.string(),
		text: z.string(),
		cta: z.string(),
		ctaLink: z.string(),
	}),
	certificationDetails: z.object({
		product: z.enum(['terraform', 'vault']),
		data: z.object({
			whoShouldTakeExam: whoShouldTakeExamSchema,
			examDetails: examDetailsSchema,
			prerequisites: prerequisitesSchema,
		}),
	}),
	objectives: z.object({
		title: z.string(),
	}),
	renewCertifications: z.object({
		title: z.string(),
		description: z.string(),
	}),
	linkWithImage: z.object({
		title: z.string(),
		description: z.string(),
		cta: z.string(),
		ctaLink: z.string(),
	}),
	relatedCertsFooter: z.object({
		title: z.string(),
		description: z.string(),
		tempData: z.array(relatedCertsTempSchema),
		data: z.array(relatedCertsExamSchema),
	}),
	examPageContent: ExamPageContentSchema.optional(),
})

/**
 * Raw content for an individual certification program.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawCertificationProgram = z.infer<typeof CertificationProgramSchema>

/**
 * Raw content for an individual exam item.
 */
export type RawExamPageContent = z.infer<typeof ExamPageContentSchema>
