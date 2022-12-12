import { AccordionMdxItem } from './components'
import type {
	RawCertificationExam,
	RawCertificationProgram,
} from './content/schemas/certification-program'

/**
 * Certification exam content, after being prepared for the client.
 */
export interface CertificationExam
	extends Omit<RawCertificationExam, 'faqSlug'> {
	faqItems: AccordionMdxItem[]
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

/**
 * Certification program page content, after being prepared for the client.
 */
export interface CertificationProgramItem {
	slug: string
	pageContent: CertificationProgram
}
