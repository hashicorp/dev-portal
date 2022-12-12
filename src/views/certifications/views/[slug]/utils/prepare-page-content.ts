import path from 'path'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationExam } from 'views/certifications/content/schemas/certification-program'
import { getFaqsFromMdx } from 'views/certifications/content/utils/get-faqs-from-mdx'
import { readLocalFile } from 'views/certifications/content/utils'

const EXAM_CONTENT_DIR = 'src/content/certifications/exam-faqs'

export async function preparePageContent(
	rawPageContent: CertificationProgram
): Promise<CertificationProgram> {
	const preparedExamsContent = await Promise.all(
		rawPageContent.exams.map(prepareExamContent)
	)
	return { ...rawPageContent, exams: preparedExamsContent }
}

async function prepareExamContent(
	exam: CertificationExam
): Promise<CertificationExam> {
	const faqFile = `${exam.faqSlug}.mdx`
	const faqMdxString = readLocalFile(path.join(EXAM_CONTENT_DIR, faqFile))
	const parsedFaqItems = await getFaqsFromMdx(faqMdxString)
	return { ...exam, faqItems: parsedFaqItems }
}
