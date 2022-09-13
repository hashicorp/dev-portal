import ButtonLink from 'components/button-link'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import { useCollectionProgress } from 'hooks/progress'
import { Collection, TutorialLite } from 'lib/learn-client/types'
import { ApiCollectionTutorialProgress } from 'lib/learn-client/api/api-types'
import { getTutorialSlug } from 'views/collection-view/helpers'
import ProgressBar from 'components/progress-bar'
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
	const isCompleted = completedTutorialCount == tutorials.length
	const isInProgress = isProgressStarted && !isCompleted
	const firstIncompleteTutorial = tutorials.find((tutorial: TutorialLite) => {
		const matchedProgress = progressData.find(
			(record: ApiCollectionTutorialProgress) =>
				record.tutorial_id == tutorial.id
		)
		const isIncomplete =
			!matchedProgress || matchedProgress.complete_percent !== '100'
		return isIncomplete
	})
	const ctaTutorial = firstIncompleteTutorial || tutorials[0]
	const ctaTutorialLink = {
		href: getTutorialSlug(ctaTutorial.slug, collectionSlug),
		text: isCompleted ? 'Review' : isProgressStarted ? 'Continue' : 'Start',
		ariaLabel: `${
			isCompleted
				? 'Review'
				: isProgressStarted
				? 'Continue with'
				: 'Start with'
		} ${ctaTutorial.name}`,
	}

	return (
		<>
			{/* <pre className={s.dev}>
				<code>
					{JSON.stringify(
						{
							isProgressStarted,
							isCompleted,
							tutorialCount,
							completedTutorialCount,
							ctaTutorialLink,
						},
						null,
						2
					)}
				</code>
			</pre> */}
			<div className={s.root}>
				<ButtonLink
					aria-label={ctaTutorialLink.ariaLabel}
					href={ctaTutorialLink.href}
					text={ctaTutorialLink.text}
				/>
				<div className={s.statusSection}>
					{isCompleted ? (
						<div className={s.completeIconAndLabel}>
							<IconCheckCircleFill16 className={s.completeIcon} />
							<div className={s.statusLabel}>Complete</div>
						</div>
					) : (
						<div className={s.countIconAndLabel}>
							<IconCollections16 className={s.countIcon} />
							<div className={s.statusLabel}>
								{isProgressStarted
									? `${completedTutorialCount}/${tutorialCount}`
									: `${tutorialCount} tutorial${tutorialCount == 1 ? '' : 's'}`}
							</div>
						</div>
					)}
					{isInProgress ? (
						<ProgressBar
							percentDone={(completedTutorialCount / tutorialCount) * 100}
						/>
					) : null}
				</div>
			</div>
		</>
	)
}

export default CollectionMetaProgress
