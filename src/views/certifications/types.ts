/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { MDXRemoteSerializeResult } from 'lib/next-mdx-remote'
import type {
	RawExamPageContent,
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
export type ExamPageContent = RawExamPageContent

/**
 * Certification program content, after being prepared for the client.
 */
export interface CertificationProgram
	extends RawCertificationProgram {
	examPageContent: ExamPageContent
}

/**
 * Raw page content for individual certification program pages.
 */
export interface RawCertificationProgramItem {
	slug: ProgramSlug
	pageContent: RawCertificationProgram
}
