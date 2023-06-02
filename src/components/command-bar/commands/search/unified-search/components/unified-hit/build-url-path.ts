import { getTutorialSlug } from 'views/collection-view/helpers'
import { getIntegrationUrl } from 'lib/integrations'

export function buildUrlPath(searchHit: $TSFixMe): string {
	if (searchHit.type === 'docs') {
		return `/${searchHit.objectID}`
			.replace(/\/index$/, '')
			.replace('/_docs', '/')
	} else if (searchHit.type === 'tutorial') {
		const { slug, defaultContext } = searchHit
		return getTutorialSlug(slug, defaultContext.slug)
	} else if (searchHit.type === 'integration') {
		const {
			external_only,
			external_url,
			product_slug,
			organization_slug,
			slug,
		} = searchHit
		/**
		 * TODO: refactor `getIntegrationUrl` to `Pick<>` what's actually needed.
		 * For now, using `$TSFixMe` to avoid inaccurate TS errors about what
		 * argument properties are needed for the function to work.
		 */
		return getIntegrationUrl({
			external_only,
			external_url,
			product: { slug: product_slug } as $TSFixMe,
			organization: { slug: organization_slug } as $TSFixMe,
			slug,
		} as $TSFixMe)
	} else {
		/**
		 * Something's gone wrong, this should never happen in our indexing.
		 * Link to the home page as insurance. And ideally, should log
		 * an error here.
		 * TODO: log an error maybe?
		 */
		return '/'
	}
}
