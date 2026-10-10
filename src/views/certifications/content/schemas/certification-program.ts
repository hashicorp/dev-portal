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
 * Content schema for an individual certification program.
 *
 * Certification programs are oriented around solution areas, such as
 * "Infrastructure Automation". Each certification program can contain
 * multiple specific exams.
 */
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

const relatedCertsExamSchema = z.object({
	id: z.string(),
})

export const CertificationProgramSchema = z.object({
	title: z.string(),
	hero: z.object({
		product: z.string().optional(),
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
		product: CertificationProductSlugSchema,
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
		certs: z.array(relatedCertsExamSchema),
	}),
})

/**
 * Raw content for an individual certification program.
 *
 * This raw content type represents content exactly as authored.
 * It may need to be transformed before it can be used at the view level.
 */
export type RawCertificationProgram = z.infer<typeof CertificationProgramSchema>
