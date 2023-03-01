import { makeSitemapElement } from './helpers'

export async function allDocsUrls() {
	const getDocsPaths = await fetch(
		`${process.env.MKTG_CONTENT_API}/api/all-docs-paths`
	)
	const { result: docsResult } = await getDocsPaths.json()
	return docsResult.map((page: { path: string; created_at: string }) =>
		makeSitemapElement({
			slug: `/${page.path}`,
			lastmodDate: page.created_at,
		})
	)
}
