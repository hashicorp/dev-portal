import { GetServerSidePropsContext } from 'next'

export default function SiteMap() {
	return undefined
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
	const response = await fetch(
		`https://content.hashicorp.com/api/all-docs-paths`
	)
	const { result } = await response.json()
	const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${result
					.map(
						(sitePath: { path: string; created_at: string }) =>
							`<url><loc>${
								process.env.SITE_URL || 'https://developer.hashicorp.com'
							}/${sitePath.path}</loc><lastmod>${
								sitePath.created_at
							}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`
					)
					.join('')}
    </urlset>
    `
	res.setHeader('Content-Type', 'text/xml')
	res.write(createSitemap())
	res.end()
	return {
		props: {},
	}
}
