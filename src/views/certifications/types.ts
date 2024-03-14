/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import type {
	RawCertificationExam,
	RawCertificationProgram,
	CertificationProductSlug,
	ExamTier,
} from './content/schemas/certification-program'
import { ProgramSlug } from './content/schemas/landing-page'

/**
 * Re-export ProgramSlug from this file, for convenience.
 */
export type { ProgramSlug }

/**
 * Re-export CertificationProductSlug from this file, for convenience.
 */
export type { CertificationProductSlug }

/**
 * Re-export ExamTier from this file, for convenience
 */
export type { ExamTier }

/**
 * An FAQ item consists of a title representing the questions,
 * and some serialized MDX representing the answer content.
 */
export interface FaqItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

/**
 * Certification exam content, after being prepared for the client.
 */
export interface CertificationExam
	extends Omit<RawCertificationExam, 'faqSlug'> {
	faqItems: FaqItem[]
}

/**
 * Certification program content, after being prepared for the client.
 */
export interface CertificationProgram
	extends Omit<RawCertificationProgram, 'exams'> {
	exams: CertificationExam[]
}

/**
 * Raw page content for individual certification program pages.
 */
export interface RawCertificationProgramItem {
	slug: ProgramSlug
	pageContent: RawCertificationProgram
}
