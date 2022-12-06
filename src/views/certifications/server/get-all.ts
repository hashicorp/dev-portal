import path from 'path'
import { CertificationProgramItem } from '../types'
import { readLocalFile, readLocalFilepaths } from '.'

const CONTENT_DIR = 'src/content/certifications/programs'

export function getAllCertificationProgramSlugs() {
	const filePaths = readLocalFilepaths(CONTENT_DIR)
	const slugs = filePaths.map((filePath: string) => {
		const slug = path.basename(filePath, path.extname(filePath))
		return slug
	})
	return slugs
}

export function getAllCertificationPrograms() {
	const programSlugs = getAllCertificationProgramSlugs()
	const allCertificationPrograms: CertificationProgramItem[] = programSlugs.map(
		(slug: string) => {
			const fullPath = `${CONTENT_DIR}/${slug}.json`
			const pageContent = JSON.parse(readLocalFile(fullPath))
			return { slug, pageContent }
		}
	)
	return allCertificationPrograms
}
