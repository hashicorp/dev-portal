import { useAllProgress } from 'hooks/progress'
import BaseNewLayout from 'layouts/base-new'
import AuthenticatedView from 'views/authenticated-view'
import ProgressEmptyState from './components/empty-state'
import Text from 'components/text'
import Heading from 'components/heading'
import s from './progress-test-view.module.css'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { TutorialCardsGridListWithProgress } from 'components/cards-grid-list'
import { formatTutorialCard } from 'components/tutorial-card/helpers'
import {
	formatToCollectionLite,
	formatTutorialData,
} from 'lib/learn-client/api/tutorial/formatting'
import { groupRecordsByKey } from 'lib/learn-client/api/progress/formatting'
import { formatCollectionCard } from 'components/collection-card/helpers'
import { CollectionCardWithAuthElements } from 'components/collection-card/components/with-auth-elements'

/**
 * The exported view component that handles wrapping the view content in
 * `AuthenticatedView`, which automatically handles rendering gated content.
 */
function ProgressTestView() {
	return (
		<AuthenticatedView>
			<ProgressTestViewContent />
		</AuthenticatedView>
	)
}

/**
 * The content of the ProgressTestView, that is gated behind authentication.
 */
function ProgressTestViewContent() {
	const { progress, isFetching, isRefetching } = useAllProgress({
		enabled: true,
	})
	const isFirstLoad = isFetching && !isRefetching

	if (isFirstLoad) {
		return <span>Loading</span> // TODO return loading skeleton
	}

	/**
	 * Format collections for display in cards
	 */
	const collectionsObject = groupRecordsByKey(progress, 'collection_id')
	const formattedCollections = Object.keys(collectionsObject).map(
		(collectionId) => {
			const progressRecord = collectionsObject[collectionId][0]
			const { collection } = progressRecord
			// TODO: don't have all tutorials here, not bothering to fill in
			const withTutorials = { ...collection, tutorials: [] }
			const formattedCollection = formatCollectionCard(withTutorials)
			return { ...formattedCollection, tutorialCount: -1 }
		}
	)

	/**
	 * Format tutorials for display in cards
	 */
	const formattedTutorials = progress.map(
		(p: ApiCollectionTutorialProgress) => {
			const { tutorial, collection } = p
			const formattedTutorial = formatTutorialData({
				...tutorial,
				content: null,
			})
			const tutorialForCard = {
				...formattedTutorial,
				defaultContext: formatToCollectionLite(collection),
			}
			return formatTutorialCard(tutorialForCard)
		}
	)

	return (
		<div>
			<Heading level={1} weight="bold" size={500}>
				Progress
			</Heading>
			<Text className={s.subheading}>
				View and manage your progress on tutorials and collections.
			</Text>
			{progress?.length > 0 ? (
				<>
					{formattedCollections.map((formattedCollection) => {
						return (
							<CollectionCardWithAuthElements
								key={formattedCollection.id}
								{...formattedCollection}
							/>
						)
					})}
					<br />
					<br />
					<TutorialCardsGridListWithProgress tutorials={formattedTutorials} />
					<br />
					<br />
					<pre className={s.devJson}>
						<code>
							{JSON.stringify(
								{
									progress: progress.map(
										(progressEntry: ApiCollectionTutorialProgress) => {
											const { collection_id, tutorial_id, complete_percent } =
												progressEntry
											return {
												collection_id,
												tutorial_id,
												complete_percent,
											}
										}
									),
								},
								null,
								2
							)}
						</code>
					</pre>
					<br />
					<br />
					<pre className={s.devJson}>
						<code>
							{JSON.stringify(
								{
									progress,
								},
								null,
								2
							)}
						</code>
					</pre>
				</>
			) : (
				<ProgressEmptyState />
			)}
		</div>
	)
}

ProgressTestView.layout = BaseNewLayout
export default ProgressTestView
