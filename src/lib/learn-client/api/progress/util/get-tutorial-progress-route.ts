import { TutorialIdCollectionId } from 'lib/learn-client/types'

/**
 * Given a tutorialId and collectionId,
 *
 * Return the API route where operations on the associated
 * ApiCollectionTutorialProgress record can be performed.
 */
export function getTutorialProgressRoute({
	collectionId,
	tutorialId,
}: TutorialIdCollectionId) {
	return `/collections/${collectionId}/tutorials/${tutorialId}/progress`
}
