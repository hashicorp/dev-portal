import path from 'path'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationItem } from 'views/certifications/content/schemas/certification-program'
import { getFaqsFromMdx } from 'views/certifications/content/utils/get-faqs-from-mdx'
import { readLocalFile } from 'views/certifications/content/utils'

const EXAM_CONTENT_DIR = 'src/content/certifications/exam-faqs'

export async function preparePageContent(
	rawPageContent: CertificationProgram
): Promise<CertificationProgram> {
	const preparedCertifications = await Promise.all(
		rawPageContent.certifications.map(prepareCertification)
	)
	return { ...rawPageContent, certifications: preparedCertifications }
}

async function prepareCertification(
	certification: CertificationItem
): Promise<CertificationItem> {
	const faqFile = `${certification.examFaqSlug}.mdx`
	const faqMdxString = readLocalFile(path.join(EXAM_CONTENT_DIR, faqFile))
	const parsedFaqItems = await getFaqsFromMdx(faqMdxString)
	return { ...certification, faqItems: parsedFaqItems }
}
