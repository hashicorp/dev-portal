/**
 * Map a `urlPath` on `developer.hashicorp.com` to a consistent page title.
 */
const KNOWN_PAGE_TITLES: Record<string, string> = {
	'/': 'Developer',
	'/hcp': 'HashiCorp Cloud Platform',
	'/hcp/api-docs': 'API',
}

/**
 * Given a `urlPath` on `developer.hashicorp.com`,
 * Return a page title we consistently use to refer to that URL.
 */
export function getPageTitleFromUrl(urlPath: string): string | null {
	return KNOWN_PAGE_TITLES[urlPath] || null
}
