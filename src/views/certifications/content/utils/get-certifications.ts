import path from 'path'
import { RawCertificationProgramItem } from '../../types'
import { CertificationProgramSchema } from '../schemas/certification-program'
import { readLocalFile, readLocalFilepaths } from '.'

const CONTENT_DIR = 'src/content/certifications/programs'
const CONTENT_TYPE = '.json'

/**
 * Get an array of certification program slugs.
 *
 * For context, we render these as pages at `/certifications/<slug>`.
 * We also want to show an overview of programs at `/certifications`.
 */
export function getAllCertificationProgramSlugs(): string[] {
	const filePaths = readLocalFilepaths(CONTENT_DIR)
	const slugs = filePaths
		.filter((filePath: string) => {
			return path.extname(filePath) === CONTENT_TYPE
		})
		.map((filePath: string) => {
			const slug = path.basename(filePath, CONTENT_TYPE)
			return slug
		})
	return slugs
}

/**
 * Get data for a specific certification program.
 */
export function getCertificationProgram(
	slug: string
): RawCertificationProgramItem {
	const fullPath = `${CONTENT_DIR}/${slug}.json`
	const pageContent = CertificationProgramSchema.parse(
		JSON.parse(readLocalFile(fullPath))
	)
	return { slug, pageContent }
}

/**
 * Get data for all certification programs at once.
 *
 * Useful for rendering detailed overview sections
 * on the `/certifications` landing page.
 */
export function getAllCertificationPrograms(): RawCertificationProgramItem[] {
	const programSlugs = getAllCertificationProgramSlugs()
	return programSlugs.map(getCertificationProgram)
}
