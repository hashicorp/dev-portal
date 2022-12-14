import { RawCertificationProgramItem } from 'views/certifications/types'
import { CertificationProgramSummary } from '../types'

/**
 * Given an array of programs data, and an array of program slugs in order,
 * Return an array of program summary objects, in the specified order.
 */
export function formatProgramSummaries(
	programs: RawCertificationProgramItem[],
	slugsInOrder: ProgramSlug[]
): CertificationProgramSummary[] {
	// Transform the provided `slugsInOrder` array into summary objects
	const programSummaries: CertificationProgramSummary[] = slugsInOrder.map(
		(targetSlug: string) => {
			const program = programs.find((p) => p.slug === targetSlug)
			// If we can't find the target program, throw an error
			if (!program) {
				throw new Error(
					`formatProgramSummaries: could not find Certification program with slug "${targetSlug}". Please ensure all slugs in "" reference existing Certification programs in "src/content/certifications/programs".`
				)
			}
			// Format the full program data into a summary object
			return {
				slug: program.slug,
				title: program.pageContent.summary.heading,
				description: program.pageContent.summary.description,
				exams: program.pageContent.exams.map((exam) => {
					return {
						title: exam.title,
						productSlug: exam.productSlug,
						url: exam.links?.prepare ?? null,
					}
				}),
			}
		}
	)
	// Return the summary objects
	return programSummaries
}
