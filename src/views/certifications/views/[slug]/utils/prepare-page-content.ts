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

export async function preparePageContent(
	rawPageContent: RawCertificationProgram
): Promise<CertificationProgram> {
	const preparedExamsContent = await Promise.all(
		rawPageContent.exams.map(prepareExamContent)
	)
	return { ...rawPageContent, exams: preparedExamsContent }
}

async function prepareExamContent(
	exam: RawCertificationExam
): Promise<CertificationExam> {
	const faqFile = `${exam.faqSlug}.mdx`
	const faqMdxString = readLocalFile(path.join(EXAM_CONTENT_DIR, faqFile))
	const parsedFaqItems = await getFaqsFromMdx(faqMdxString)
	return { ...exam, faqItems: parsedFaqItems }
}
