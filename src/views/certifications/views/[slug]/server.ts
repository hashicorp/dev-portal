import { GetStaticPropsContext } from 'next'
import { formatCertificationsNavProps } from '../../components/certifications-nav/helpers'
import { CertificationPageProps } from './types'
import { CertificationProgramItem } from '../../types'
import {
	getAllCertificationProgramSlugs,
	getAllCertificationPrograms,
} from '../../helpers'
import { preparePageContent } from './utils/prepare-page-content'

export async function getStaticProps({
	params: { slug },
}: GetStaticPropsContext): Promise<{ props: CertificationPageProps }> {
	const allPrograms = getAllCertificationPrograms()
	const { pageContent: rawPageContent } = allPrograms.find(
		(p: CertificationProgramItem) => p.slug === slug
	)

	const pageContent = await preparePageContent(rawPageContent)

	const navProps = formatCertificationsNavProps(allPrograms)

	return {
		props: { navProps, pageContent },
	}
}

export async function getStaticPaths() {
	const slugs = getAllCertificationProgramSlugs()
	const paths = slugs.map((slug: string) => ({ params: { slug } }))
	return { paths, fallback: false }
}
