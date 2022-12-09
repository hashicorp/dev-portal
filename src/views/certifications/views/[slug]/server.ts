import { GetStaticPropsContext } from 'next'
import { formatCertificationsNavProps } from '../../components/certifications-nav/helpers'
import { CertificationPageProps } from './types'
import {
	getAllCertificationProgramSlugs,
	getAllCertificationPrograms,
	getCertificationProgram,
} from 'views/certifications/content/utils'
import { preparePageContent } from './utils/prepare-page-content'

export async function getStaticProps({
	params: { slug: rawSlug },
}: GetStaticPropsContext): Promise<{ props: CertificationPageProps }> {
	/**
	 * Filter all programs to find the program we're rendering
	 */
	const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug
	const { pageContent: rawPageContent } = getCertificationProgram(slug)
	const pageContent = await preparePageContent(rawPageContent)

	/**
	 * Build temporary nav props for a dev nav header.
	 * TODO: remove this later, not actually part of the design spec.
	 */
	const navProps = formatCertificationsNavProps(getAllCertificationPrograms())

	return {
		props: { navProps, pageContent, slug },
	}
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
