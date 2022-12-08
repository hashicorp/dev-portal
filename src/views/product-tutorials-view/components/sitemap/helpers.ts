import {
	Collection as ClientCollection,
	TutorialLite as ClientTutorialLite,
} from 'lib/learn-client/types'
import { SitemapCollection } from './types'

export function formatSitemapCollection(
	collection: ClientCollection
): SitemapCollection {
	return {
		id: collection.id,
		slug: collection.slug,
		name: collection.name,
		tutorials: collection.tutorials.map((t: ClientTutorialLite) => ({
			id: t.id,
			slug: t.slug,
			name: t.name,
		})),
	}
}
