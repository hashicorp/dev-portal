// import { serialize } from 'next-mdx-remote/serialize'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationItem } from 'views/certifications/content/schemas/certification-program'
import { getExamFaqs } from 'views/certifications/content/utils/get-exam-faqs'

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
	const parsedFaqItems = await getExamFaqs(certification.examFaqSlug)
	return { ...certification, faqItems: parsedFaqItems }
}
