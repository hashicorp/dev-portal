import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { allDocsUrls, allTutorialsUrls } from 'lib/sitemap'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	// returns an array of docs content sitemap objects per slug
	const docsUrlsPromise = allDocsUrls()
	// returns an array of tutorials content sitemap objects per slug
	const tutorialsUrlsPromise = allTutorialsUrls()
	const [docsUrls, tutorialsUrls] = await Promise.all([
		docsUrlsPromise,
		tutorialsUrlsPromise,
	])

	const fields = [...docsUrls, ...tutorialsUrls]

	return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
