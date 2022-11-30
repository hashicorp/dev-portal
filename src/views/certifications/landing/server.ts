import rivetQuery from '@hashicorp/platform-cms'
import { GetStaticPropsResult } from 'next'
import { formatCertificationsNavProps } from '../components/certifications-nav/helpers'
import pageQuery from './page-query.graphql'
import { CertificationLandingProps } from './types'

/**
 * Note: starting by fetching Dato content for now, because it's what we have
 * so far, and lists all sub-pages too. Could pull down and write into JSON
 * or YAML files or whatnot if we'd prefer to have it local to dev dot.
 */
export async function getStaticProps(): Promise<
	GetStaticPropsResult<CertificationLandingProps>
> {
	const pageContent = await rivetQuery({
		query: pageQuery,
	})

	const navProps = formatCertificationsNavProps(
		pageContent.allProductCertificationPages
	)

	return {
		props: { pageContent, navProps },
	}
}
