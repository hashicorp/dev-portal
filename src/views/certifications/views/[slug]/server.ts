import { GetStaticPropsContext } from 'next'
import { CertificationPageProps } from './types'
import {
	getAllCertificationProgramSlugs,
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

	return {
		props: { pageContent, slug },
	}
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
