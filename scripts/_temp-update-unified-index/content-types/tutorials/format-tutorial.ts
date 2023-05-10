import { NormalizedSearchObject } from '../../types'
import { collectHeadings } from '../../utils/collect-headings'

type ApiTutorial = $TSFixMe

/**
 * Format a tutorial API record into a normalized search object.
 *
 * Note: only need _some_ fields to be normalized, could extend
 * the `NormalizedSearchObject` interface. However, may not be necessary
 * depending on what we want to show in the Search UI.
 *
 * For example, if the Search UI doesn't show `readTime`, we don't really have
 * a strong case to include it here. Maybe worth including anyways... though
 * we can also update this workflow later, and re-run it manually, based
 * on an actual need for such attributes, rather than trying to preemptively
 * add them.
 */
export async function formatTutorial(
	tutorialRecord: ApiTutorial
): Promise<NormalizedSearchObject> {
	const tutorialSlug = tutorialRecord.slug.split('/')[1]
	const collectionSlug = tutorialRecord.default_collection.slug.split('/')[1]
	const collectionSection = tutorialRecord.default_collection.slug.split('/')[0]
	/**
	 * TODO: maybe shouldn't really put URL path in search object, I think?
	 * Seems like an implementation detail of the site...
	 * But not really sure how else to handle this. It seems otherwise
	 * we'd have to return a bunch of non-normalized data, which we'd only
	 * be using to construct the `urlPath` on the client side anyways.
	 *
	 * As well, I think we might want to match on the `urlPath`.
	 * So as much as it's kind of coupled to the UI, it feels possible
	 * that it's worth maintaining, rather than trying to create a completely
	 * UI-and-URL agnostic search object.
	 */
	let urlPath
	if (collectionSection === 'well-architected-framework') {
		urlPath = `/${collectionSection}/${collectionSlug}/${tutorialSlug}`
	} else if (collectionSection === 'cloud') {
		urlPath = `/hcp/tutorials/${collectionSlug}/${tutorialSlug}`
	} else {
		urlPath = `/${collectionSection}/tutorials/${collectionSlug}/${tutorialSlug}`
	}
	return {
		objectID: tutorialRecord.id,
		description: tutorialRecord.description,
		page_title: tutorialRecord.name,
		products: tutorialRecord.products_used.map((p: $TSFixMe) => p.product.slug),
		urlPath,
		headings: await collectHeadings(tutorialRecord.content),
		codeListItems: [],
	}
}
