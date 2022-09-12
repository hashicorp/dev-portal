import { getCollections } from 'lib/learn-client/api/collection'
import { getTutorials } from 'lib/learn-client/api/tutorial'
import {
	Tutorial as ClientTutorial,
	Collection as ClientCollection,
} from 'lib/learn-client/types'

export interface InlineTutorials {
	[slug: string]: ClientTutorial
}

export interface InlineCollections {
	[slug: string]: ClientCollection
}

export async function getInlineTutorials(
	tutorialSlugs: string[]
): Promise<InlineTutorials> {
	const tutorials = await getTutorials(tutorialSlugs, false)

	const formattedTutorials = tutorials.reduce((acc, tutorial) => {
		return Object.assign(acc, {
			[tutorial.slug]: tutorial,
		})
	}, {})

	return formattedTutorials
}

export async function getInlineCollections(
	collectionSlugs: string[]
): Promise<InlineCollections> {
	const collections = await getCollections(collectionSlugs)
	const formattedCollections = collections.reduce((acc, collection) => {
		return Object.assign(acc, {
			[collection.slug]: collection,
		})
	}, {})

	return formattedCollections
}
