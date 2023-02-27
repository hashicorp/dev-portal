import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { allDocsUrls, allTutorialsUrls } from 'lib/sitemap'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	// returns an array of docs content sitemap objects per slug
	const docsUrls = await allDocsUrls()
	// returns an array of tutorials content sitemap objects per slug
	const tutorialsUrls = await allTutorialsUrls()
	const fields = [...docsUrls, ...tutorialsUrls]

	return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
