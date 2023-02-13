/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { readLocalFile } from 'lib/read-local-file'
import {
	CertificationExam,
	CertificationProgram,
} from 'views/certifications/types'
import {
	RawCertificationExam,
	RawCertificationProgram,
} from 'views/certifications/content/schemas/certification-program'
import { getFaqsFromMdx } from 'views/certifications/content/utils'

const EXAM_CONTENT_DIR = 'src/content/certifications/exam-faqs'

/**
 * Process raw authored page content.
 *
 * Currently focused on transforming FAQ MDX slugs for each exam
 * into FAQ items, each with processed `mdxSource`.
 */
export async function preparePageContent(
	rawPageContent: RawCertificationProgram
): Promise<CertificationProgram> {
	const preparedExamsContent = await Promise.all(
		rawPageContent.exams.map(prepareExamContent)
	)
	return { ...rawPageContent, exams: preparedExamsContent }
}

/**
 * Transforms an exam item with an `faqSlug` into an exam item
 * with full `faqItems` data, ready to render in the view.
 */
async function prepareExamContent(
	exam: RawCertificationExam
): Promise<CertificationExam> {
	const faqFile = `${exam.faqSlug}.mdx`
	const faqMdxString = readLocalFile(path.join(EXAM_CONTENT_DIR, faqFile))
	const parsedFaqItems = await getFaqsFromMdx(faqMdxString)
	return { ...exam, faqItems: parsedFaqItems }
}
