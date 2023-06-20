import { getTutorialSlug } from 'views/collection-view/helpers'
import { getIntegrationUrl } from 'lib/integrations'
// Types
import type { Hit } from 'instantsearch.js'
import { buildUrlPath } from './build-url-path'

/**
 * Builds a URL path to an arbitrary hit from our unified `<env>_DEVDOT_omni`
 * Algolia indices. Uses highlighted facets to build a highlighted URL path.
 *
 * TODO: construct urlPath from hit data,
 * use highlighted hit data I think?
 * (Reference how we do this currently for each content type, we have
 * all the same data so should be able to do the same thing here)
 *
 * Alternately, add `urlPath` to all search objects.
 * On the fence about which to do, want to time-box constructing
 * the `urlPath` client side to see how much effort it is,
 * since it feels like a better solution maybe?
 *
 * Although then won't match say `<product>/<content_type>` because
 * `product` and `content_type` are in separate properties 🤔
 * But I guess `<product> <content_type>` (space not slash)
 * would work fine as a query?
 *
 * Only disadvantage of `urlPath` in search object is it needs
 * to be updated in tandem with front-end. To address this, could
 * add a different `urlPath_<changeIdentifier>` before rolling out a
 * new feature, once the old `hit.urlPath` is no longer used then
 * migrate to it by making both values the same, and switching which
 * is used, and then once `urlPath_<changeIdentifier>` is no longer
 * used remove it completely from indexing. Complex though if URL
 * changes happen, which they're kind of expected to!
 */
export function buildUrlPathWithHighlights(searchHit: Hit): string {
	const urlPath = buildUrlPath(searchHit)
	if (searchHit.type === 'docs') {
		/**
		 * TODO: implement urlPath highlighting for `integration` records.
		 *
		 * TODO: urlPath is constructed from objectID... which we can't
		 * seem to search against. I think docs needs a "slug" property?
		 */
		return urlPath
	} else if (searchHit.type === 'tutorial') {
		let urlPathWithHighlight = urlPath
		const { slug, defaultContext } = searchHit._highlightResult
		/**
		 * Apply any highlights from the tutorial slug
		 *
		 * TODO: consider isolating the tutorial slug as a separate prop in algolia?
		 * Currently, contains the `<product>/` prefix to ensure uniqueness.
		 * This is not necessary in Algolia, we have an objectID for uniqueness.
		 * The `<product>/` prefix adds complexity for tutorial slug construction.
		 */
		if ('value' in slug && typeof slug.value === 'string') {
			// Replace closing </mark> highlight HTML with <-mark>,
			// so that we can split on the `<product>/` slug part to get
			// the isolated tutorial Slug.
			const slugWithoutProduct = searchHit.slug.split('/').slice(1).join('/')
			const slugHighlightWithoutProduct = slug.value
				.replace(/<\/mark>/g, '<-mark>')
				.split('/')
				.slice(1)
				.join('/')
				.replace(/<-mark>/g, '</mark>')
			// TODO: this is a naive replace, we could first isolate the segment
			// of the URL that we know is the tutorial slug, and only apply
			// the `replace` to that segment.
			urlPathWithHighlight = urlPathWithHighlight.replace(
				slugWithoutProduct,
				slugHighlightWithoutProduct
			)
		}
		/**
		 * Apply any highlights from the tutorial slug
		 *
		 * TODO: consider isolating the tutorial slug as a separate prop in algolia?
		 * Currently, contains the `<product>/` prefix to ensure uniqueness.
		 * This is not necessary in Algolia, we have an objectID for uniqueness.
		 * The `<product>/` prefix adds complexity for tutorial slug construction.
		 */
		const collectionSlug = 'slug' in defaultContext && defaultContext.slug
		if ('value' in collectionSlug && typeof collectionSlug.value === 'string') {
			// Replace closing </mark> highlight HTML with <-mark>,
			// so that we can split on the `<product>/` slug part to get
			// the isolated collection Slug.
			const collectionSlugHighlightWithoutProduct = collectionSlug.value
				.replace(/<\/mark>/g, '<-mark>')
				.split('/')
				.slice(1)
				.join('/')
				.replace(/<-mark>/g, '</mark>')
			// Apply the same formatting to the non-highlighted collection slug
			const collectionSlugWithoutProduct = searchHit.defaultContext.slug
				.split('/')
				.slice(1)
				.join('/')
			// TODO: this is a naive replace, we could first isolate the segment
			// of the URL that we know is the collection slug, and only apply
			// the `replace` to that segment.
			urlPathWithHighlight = urlPathWithHighlight.replace(
				collectionSlugWithoutProduct,
				collectionSlugHighlightWithoutProduct
			)
		}
		// Return the urlPath with added highlights
		return urlPathWithHighlight
	} else if (searchHit.type === 'integration') {
		/**
		 * TODO: implement urlPath highlighting for `integration` records.
		 */
		return urlPath
	} else {
		/**
		 * This is an unknown search hit type.
		 * We can assume we already warned about this in `buildUrlPath`.
		 */
		return urlPath
	}
}
