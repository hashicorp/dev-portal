import { getPageTitleFromUrl } from './get-page-title-from-url'
import type { BreadcrumbLink } from 'components/breadcrumb-bar'

/**
 * This is a list of URL paths on `developer.hashicorp.com`
 * that may appear in breadcrumb bars, but that we know will 404
 * as we don't yet have pages for them.
 */
const KNOWN_404_URLS = [
	'/hcp/api-docs', // Note: no URL here, as we don't yet have a page
]

/**
 * Given a `urlPath` on `developer.hashicorp.com`,
 * Return a set of breadcrumb link items representing each URL segment
 * leading to the page at `urlPath`.
 *
 * Note: if the URL does not have a known page title in `getPageTitleFromUrl`,
 * we fallback to using the URL segment as the breadcrumb title.
 *
 * Note: if the URL is a known 404, then the resulting breadcrumb link
 * will have a `url` property that is `null`.
 */
export function getBreadcrumbLinks(urlPath: string): BreadcrumbLink[] {
	const breadcrumbLinks: BreadcrumbLink[] = []
	const segments = urlPath.split('/')
	for (let i = 0; i < segments.length; i++) {
		const url = i == 0 ? '/' : segments.slice(0, i + 1).join('/')
		const title = getPageTitleFromUrl(url) || segments[i]
		const isKnown404 = KNOWN_404_URLS.includes(url)
		breadcrumbLinks.push({ title, url: isKnown404 ? null : url })
	}
	return breadcrumbLinks
}
