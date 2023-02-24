import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const response = await fetch(
		`https://content.hashicorp.com/api/all-docs-paths`
	)

	const { result } = await response.json()
	const fields = result.map((page: { path: string; created_at: string }) => ({
		loc: `${__config.dev_dot.canonical_base_url}/${page.path}`,
		lastmod: page.created_at,
		priority: 0.7,
		changefreq: 'daily',
	}))

	return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {
	return null
}
