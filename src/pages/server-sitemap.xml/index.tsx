import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { allDocsUrls, allIntegrationsUrls, allTutorialsUrls } from 'lib/sitemap'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const integrationsUrlsPromise = allIntegrationsUrls()
	const docsUrlsPromise = allDocsUrls()
	const tutorialsUrlsPromise = allTutorialsUrls()

	const [integrationsUrls, docsUrls, tutorialsUrls] = await Promise.all([
		integrationsUrlsPromise,
		docsUrlsPromise,
		tutorialsUrlsPromise,
	])

	const fields = [
		...integrationsUrls,
		...docsUrls,
		...tutorialsUrls,
		// more content-type urls
	]

	return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
