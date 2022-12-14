import { GetStaticPropsContext } from 'next'
import {
	getAllCertificationProgramSlugs,
	getCertificationProgram,
} from 'views/certifications/content/utils'
import { ProgramSlug } from 'views/certifications/types'
import { CertificationProgramViewProps } from './types'

export async function getStaticProps({
	params: { slug },
}: GetStaticPropsContext<{ slug: ProgramSlug }>): Promise<{
	props: CertificationProgramViewProps
}> {
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
