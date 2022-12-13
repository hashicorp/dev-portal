import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type {
	RawCertificationExam,
	RawCertificationProgram,
} from './content/schemas/certification-program'

/**
 * An FAQ item consists of a title representing the questions,
 * and some serialized MDX representing the answer content.
 */
export interface FaqItem {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

/**
 * Program slugs are mainly used for stylistic tweaks. This type, and related
 * components,  will need to expanded if additional programs are added.
 */
export type ProgramSlug =
	| 'infrastructure-automation'
	| 'security-automation'
	| 'networking-automation'

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
	slug: string
	pageContent: RawCertificationProgram
}
