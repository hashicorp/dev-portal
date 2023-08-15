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
 * Map a `urlPath` on `developer.hashicorp.com` to a consistent page title.
 */
const KNOWN_URL_TITLE: Record<string, string> = {
	'/': 'Developer',
	'/hcp': 'HashiCorp Cloud Platform',
}

/**
 * Map the final segment of a `urlPath` to a generic page title.
 * This is intended for segments that may appear frequently in many URLs.
 *
 * Rather than specify duplicative entries for specific URLs, we can
 * specify a single entry for a common URL segment.
 *
 * For example:
 * - `/waypoint/api-docs` breadcrumb title should be `API`
 * - `/boundary/api-docs` breadcrumb title should be `API`
 * - `/hcp/api-docs` breadcrumb title should be `API`
 * - ...etc
 */
const KNOWN_URL_SEGMENT_TITLE: Record<string, string> = {
	'api-docs': 'API',
}

/**
 * Given a `urlPath` on `developer.hashicorp.com`,
 * Return a page title we consistently use to refer to that URL.
 *
 * If the provided `urlPath` does not have a known breadcrumb title,
 * we return the final URL segment of the path as the breadcrumb title.
 */
export function getBreadcrumbTitle(urlPath: string): string | null {
	if (KNOWN_URL_TITLE[urlPath]) {
		// If we have a URL-specific entry, favour that
		return KNOWN_URL_TITLE[urlPath]
	} else {
		// If we have a segment-specific entry, return that, or `null` otherwise
		const segments = urlPath.split('/')
		const finalSegment = segments[segments.length - 1]
		return KNOWN_URL_SEGMENT_TITLE[finalSegment] || null
	}
}

/**
 * Given a `urlPath` on `developer.hashicorp.com`,
 * Return a set of breadcrumb link items representing each URL segment
 * leading to the page at `urlPath`.
 *
 * Note: if the URL does not have a known page title in `getBreadcrumbTitle`,
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
		const title = getBreadcrumbTitle(url) || segments[i]
		const isKnown404 = KNOWN_404_URLS.includes(url)
		breadcrumbLinks.push({ title, url: isKnown404 ? null : url })
	}
	return breadcrumbLinks
}
