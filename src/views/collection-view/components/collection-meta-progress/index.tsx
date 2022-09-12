import { useCollectionProgress } from 'hooks/progress'
import { Collection, TutorialLite } from 'lib/learn-client/types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import s from './collection-meta-progress.module.css'

function CollectionMetaProgress({ collection }: { collection: Collection }) {
	const { id: collectionId, slug: collectionSlug, tutorials } = collection

	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: rawProgressData } = useCollectionProgress({ collectionId })
	const progressData = rawProgressData || []

	/**
	 * TODO: maybe the below should be in a `select` function
	 * passed to useCollectionProgress.
	 */
	const tutorialCount = tutorials.length
	const completedTutorialCount = progressData.filter(
		(record: ApiCollectionTutorialProgress) => {
			return record.complete_percent == '100'
		}
	).length
	const isProgressStarted = completedTutorialCount > 0
	const isProgressCompleted = completedTutorialCount == tutorials.length
	const firstIncompleteTutorial = tutorials.find((tutorial: TutorialLite) => {
		const matchedProgress = progressData.find(
			(record: ApiCollectionTutorialProgress) =>
				record.tutorial_id == tutorial.id
		)
		const isIncomplete =
			!matchedProgress || matchedProgress.complete_percent !== '100'
		return isIncomplete
	})
	const ctaTutorialLink = {
		href: getTutorialSlug(firstIncompleteTutorial.slug, collectionSlug),
		text: `${
			isProgressCompleted ? 'Review' : isProgressStarted ? 'Continue' : 'Start'
		} (${firstIncompleteTutorial.slug})`,
	}

	return (
		<>
			<pre className={s.root}>
				<code>
					{JSON.stringify(
						{
							isProgressStarted,
							isProgressCompleted,
							tutorialCount,
							completedTutorialCount,
							ctaTutorialLink,
						},
						null,
						2
					)}
				</code>
			</pre>
			<div className={s.root}>
				<p>
					<a href={ctaTutorialLink.href}>{ctaTutorialLink.text}</a>
				</p>
				<p>
					{isProgressCompleted
						? 'Complete'
						: isProgressStarted
						? `${completedTutorialCount}/${tutorialCount} (progress bar)`
						: `${tutorialCount} tutorials`}
				</p>
			</div>
		</>
	)
}

export default CollectionMetaProgress
