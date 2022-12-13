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
	// Filter with `slug` for the target program
	const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug
	// Fetch the authored page content
	const { pageContent: rawPageContent } = getCertificationProgram(slug)
	// Prepare the page content for rendering, such as prepping MDX source
	const pageContent = await preparePageContent(rawPageContent)
	// Return static props
	return { props: { pageContent, slug } }
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
