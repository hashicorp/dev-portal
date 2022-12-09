import path from 'path'
import { CertificationProgramItem } from '../../types'
import { CertificationProgramSchema } from '../schemas/certification-program'
import { readLocalFile, readLocalFilepaths } from '.'

const CONTENT_DIR = 'src/content/certifications/programs'
const CONTENT_TYPE = '.json'

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

export function getCertificationProgram(
	slug: string
): CertificationProgramItem {
	const fullPath = `${CONTENT_DIR}/${slug}.json`
	const pageContent = CertificationProgramSchema.parse(
		JSON.parse(readLocalFile(fullPath))
	)
	return { slug, pageContent }
}

export function getAllCertificationPrograms(): CertificationProgramItem[] {
	const programSlugs = getAllCertificationProgramSlugs()
	return programSlugs.map(getCertificationProgram)
}
