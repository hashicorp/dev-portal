import { formatCertificationsNavProps } from '../../components/certifications-nav/helpers'
import { readLocalFile, getAllCertificationPrograms } from '../../helpers'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import { LandingPageSchema } from 'views/certifications/schemas/landing-page'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	// Ensure the authored content matches our expected schema
	const pageContent = LandingPageSchema.parse(
		JSON.parse(readLocalFile('src/content/certifications/landing.json'))
	)

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
		props: { navProps, pageContent, programSummaries },
	}
}
