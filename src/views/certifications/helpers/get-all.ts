import path from 'path'
import { CertificationProgramItem } from '../types'
import { CertificationProgramSchema } from '../schemas/certification-program'
import { readLocalFile, readLocalFilepaths } from '.'

const CONTENT_DIR = 'src/content/certifications/programs'

export function getAllCertificationProgramSlugs(): string[] {
	const filePaths = readLocalFilepaths(CONTENT_DIR)
	const slugs = filePaths.map((filePath: string) => {
		const slug = path.basename(filePath, path.extname(filePath))
		return slug
	})
	return slugs
}

export function getAllCertificationPrograms(): CertificationProgramItem[] {
	const programSlugs = getAllCertificationProgramSlugs()
	const allCertificationPrograms: CertificationProgramItem[] = programSlugs.map(
		(slug: string) => {
			const fullPath = `${CONTENT_DIR}/${slug}.json`
			const pageContent = CertificationProgramSchema.parse(
				JSON.parse(readLocalFile(fullPath))
			)
			return { slug, pageContent }
		}
	)
	return allCertificationPrograms
}
