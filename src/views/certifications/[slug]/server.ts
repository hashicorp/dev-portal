import rivetQuery from '@hashicorp/platform-cms'
import { GetStaticPropsContext } from 'next'
import { formatCertificationsNavProps } from '../components/certifications-nav/helpers'
import pageQuery from './page-query.graphql'
import staticPathsQuery from './static-paths-query.graphql'
import { CertificationPageProps } from './types'

export async function getStaticProps({
	params: { slug },
}: GetStaticPropsContext): Promise<{ props: CertificationPageProps }> {
	const { allProductCertificationPages: allPages } = await rivetQuery({
		query: pageQuery,
	})

	const navProps = formatCertificationsNavProps(allPages)
	const pageContent = allPages.find((page) => page.slug === slug)

	return {
		props: { navProps, pageContent },
	}
}

export async function getStaticPaths() {
	const data = await rivetQuery({ query: staticPathsQuery })
	return {
		paths: data.allProductCertificationPages.map((page) => ({
			params: { slug: page.slug },
		})),
		fallback: false,
	}
}
