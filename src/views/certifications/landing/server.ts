import { formatCertificationsNavProps } from '../components/certifications-nav/helpers'
import { readLocalFile, getAllCertificationPrograms } from '../server'
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
	const allPrograms = getAllCertificationPrograms()
	const navProps = formatCertificationsNavProps(allPrograms)

	return {
		props: { navProps, pageContent },
	}
}
