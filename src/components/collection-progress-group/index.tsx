import { useMemo } from 'react'
import ButtonLink from 'components/button-link'
import { useCollectionProgress } from 'hooks/progress'
import { Collection } from 'lib/learn-client/types'
import { parseCollectionProgress } from './helpers'
import CollectionProgressStatusSection from './components/collection-progress-status-section'
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
	const { completedTutorialCount, isInProgress, tutorialCount, tutorialCta } =
		useMemo(
			() => parseCollectionProgress(progressData, tutorials, { id, slug }),
			[progressData, tutorials, id, slug]
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
