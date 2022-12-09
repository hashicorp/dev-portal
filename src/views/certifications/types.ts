import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type { CertificationProgram } from './content/schemas/certification-program'

export type FaqItem = {
	title: string
	mdxSource: MDXRemoteSerializeResult
}

export type { CertificationProgram }
export interface CertificationProgramItem {
	slug: string
	pageContent: CertificationProgram
}
