import fs from 'fs'
import path from 'path'
import { GetStaticPropsResult } from 'next'
import { CertificationLandingProps } from './types'

/**
 * Read in local content from the filesystem.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	const pageContent = JSON.parse(
		readLocalFile('src/content/certifications/landing.json')
	)

	return {
		props: { pageContent },
	}
}

/**
 * Read a local file from getStaticProps context,
 * using `process.cwd()` to resolve the provided filePath.
 */
function readLocalFile(filePath: string) {
	const fullPath = path.join(process.cwd(), filePath)
	return fs.readFileSync(fullPath, 'utf8')
}
