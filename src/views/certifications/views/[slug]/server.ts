import { GetStaticPropsContext } from 'next'
import {
	getAllCertificationProgramSlugs,
	getCertificationProgram,
} from 'views/certifications/content/utils'
import { CertificationProgramViewProps } from './types'

export async function getStaticProps({
	params: { slug: rawSlug },
}: GetStaticPropsContext): Promise<{ props: CertificationProgramViewProps }> {
	// Filter with `slug` for the target program
	const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug
	// Fetch the authored page content
	const { pageContent } = getCertificationProgram(slug)
	// Return static props
	return { props: { pageContent, slug } }
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
