import path from 'path'
import { formatCertificationsNavProps } from '../../components/certifications-nav/helpers'
import { readLocalFile, getAllCertificationPrograms } from '../../content/utils'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import { LandingPageSchema } from 'views/certifications/content/schemas/landing-page'
import { getFaqsFromMdx } from 'views/certifications/content/utils/get-faqs-from-mdx'

const CONTENT_DIR = 'src/content/certifications'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	/**
	 * Ensure the authored content matches our expected schema
	 */
	const contentString = readLocalFile(path.join(CONTENT_DIR, 'landing.json'))
	const pageContent = LandingPageSchema.parse(JSON.parse(contentString))

	/**
	 * Parse FAQs from an MDX file
	 */
	const faqMdxString = readLocalFile(path.join(CONTENT_DIR, 'landing-faq.mdx'))
	const faqItems = await getFaqsFromMdx(faqMdxString)

	/**
	 * TODO: document more of this
	 */
	const allPrograms = getAllCertificationPrograms()
	const navProps = formatCertificationsNavProps(allPrograms)

	const programSummaries: CertificationProgramSummary[] =
		pageContent.programSummaryOrder.map((targetSlug: string) => {
			const program = allPrograms.find((p) => p.slug === targetSlug)
			return {
				slug: program.slug,
				title: program.pageContent.summary.heading,
				description: program.pageContent.summary.description,
				certifications: program.pageContent.certifications.map(
					(certification) => {
						return {
							title: certification.title,
							productSlug: certification.productSlug,
							url: certification.links?.prepare ?? null,
						}
					}
				),
			}
		})

	return {
		props: { navProps, pageContent, programSummaries, faqItems },
	}
}
