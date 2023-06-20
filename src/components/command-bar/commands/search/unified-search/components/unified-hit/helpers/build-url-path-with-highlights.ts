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
 *
 * THOUGHT on HIGHLIGHTING A "URL PATH": maybe a middle path here could be
 * to have `breadcrumb`, as a consistent attribute across all unified search
 * index entries. This might _resemble_ a url path, but the intent would be
 * different: it would highlight the hierarchy and might not reflect the URL
 * path exactly. For example, tutorials and integrations are already equipped
 * to have pretty human-readable breadcrumbs.
 *
 * THOUGHT on DOCS: `docs` entries should almost certainly have a `slug`
 * property, right now we derive the urlPath from the objectID and this
 * 1) feels weird and 2) is major compromise and makes highlighted breadcrumbs
 * for docs nearly impossible because while Algolia allows us to search and
 * match against `objectID`, it seems to also omit `objectID` from
 * the `_highlightResult` info it gives us.
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
		 *
		 * TODO: need to handle `well-architected-framework` slugs...
		 * They seem to have needs outside of what is handled here.
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
			// Split the collection slug into the raw product, and filename
			const [rawProductSlug, collectionFilename] =
				searchHit.defaultContext.slug.split('/')
			if (
				rawProductSlug === 'well-architected-framework' ||
				rawProductSlug === 'onboarding'
			) {
				/**
				 * For "topics" or "sections", we include the "rawProductSlug" part,
				 * as unlike all other collections with standard products, the urlPath
				 * will have the full collection DB slug in it directly.
				 */
				/**
				 * TODO: this is a naive replace, we could first isolate the segment
				 * of the URL that we know is the collection slug, and only apply
				 * the `replace` to that segment.
				 */
				urlPathWithHighlight = urlPathWithHighlight.replace(
					searchHit.defaultContext.slug,
					collectionSlug.value
				)
			} else {
				// Replace closing </mark> highlight HTML with <-mark>,
				// so that we can split on the `<product>/` slug part to get
				// the isolated collection Slug.
				const collectionSlugHighlightWithoutProduct = collectionSlug.value
					.replace(/<\/mark>/g, '<-mark>')
					.split('/')
					.slice(1)
					.join('/')
					.replace(/<-mark>/g, '</mark>')
				/**
				 * TODO: this is a naive replace, we could first isolate the segment
				 * of the URL that we know is the collection slug, and only apply
				 * the `replace` to that segment.
				 */
				urlPathWithHighlight = urlPathWithHighlight.replace(
					collectionFilename,
					collectionSlugHighlightWithoutProduct
				)
			}
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
