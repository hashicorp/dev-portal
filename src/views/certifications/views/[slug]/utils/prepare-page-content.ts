import { serialize } from 'next-mdx-remote/serialize'
import { CertificationProgram } from 'views/certifications/types'
import { CertificationItem } from 'views/certifications/schemas/certification-program'

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
	const preparedFaqItems = await Promise.all(
		certification.faqItems.map(async (faqItem) => {
			return {
				title: faqItem.title,
				// content: faqItem.content,
				mdxSource: await serialize(faqItem.content),
			}
		})
	)
	return { ...certification, faqItems: preparedFaqItems }
}
