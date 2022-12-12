import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type {
	RawCertificationExam,
	RawCertificationProgram,
} from './content/schemas/certification-program'

export type FaqItem = {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export interface CertificationExam
	extends Omit<RawCertificationExam, 'faqSlug'> {
	faqItems: FaqItem[]
}

export interface CertificationProgram
	extends Omit<RawCertificationProgram, 'exams'> {
	exams: CertificationExam[]
}

export interface RawCertificationProgramItem {
	slug: string
	pageContent: RawCertificationProgram
}

export interface CertificationProgramItem {
	slug: string
	pageContent: CertificationProgram
}
