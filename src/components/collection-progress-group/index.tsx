import { useMemo } from 'react'
import ButtonLink from 'components/button-link'
import { useCollectionProgress } from 'hooks/progress'
import { Collection } from 'lib/learn-client/types'
import { getNextTutorialCta, parseCollectionProgress } from './helpers'
import { CollectionProgressStatusSection } from './components'
import s from './collection-progress-group.module.css'

/**
 * Displays collection progress status and CTA.
 */
function CollectionProgressGroup({ collection }: { collection: Collection }) {
	const { id, slug, tutorials } = collection

	/**
	 * Get collection progress, which affects the
	 * CTA bar we display for the collection.
	 */
	const { data: progressData } = useCollectionProgress({ collectionId: id })

	/**
	 * Parse the progress-related information we need from the progress records,
	 * current collection slug, and list of tutorials in this collection.
	 */
	const { completedTutorialCount, isCompleted, isInProgress, tutorialCount } =
		useMemo(
			() =>
				parseCollectionProgress(progressData, tutorials.length, { id, slug }),
			[progressData, tutorials, id, slug]
		)
	/**
	 * Parse the CTA we want to show for the "next" tutorial in the collection.
	 * This "next" tutorial varies based on the progress state
	 */
	const tutorialCta = useMemo(
		() =>
			getNextTutorialCta({
				progressData,
				tutorials,
				isCompleted,
				isInProgress,
				completedTutorialCount,
				tutorialCount,
				collectionSlug: slug,
			}),
		[
			completedTutorialCount,
			isCompleted,
			isInProgress,
			progressData,
			slug,
			tutorialCount,
			tutorials,
		]
	)

	return (
		<div className={s.root}>
			<ButtonLink
				aria-label={tutorialCta.ariaLabel}
				href={tutorialCta.href}
				text={tutorialCta.text}
			/>
			<CollectionProgressStatusSection
				completedTutorialCount={completedTutorialCount}
				tutorialCount={tutorialCount}
				isInProgress={isInProgress}
			/>
		</div>
	)
}

/**
 * Note: ButtonLink is exported here so that Swingset can work.
 * We can use peerComponents for Swingset, but this doesn't make
 * the component available in LiveComponent, which is a spot where
 * we want it.
 */
export { parseCollectionProgress, CollectionProgressStatusSection, ButtonLink }
export default CollectionProgressGroup
