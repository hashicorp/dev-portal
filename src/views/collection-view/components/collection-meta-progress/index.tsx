import { useMemo } from 'react'
import ButtonLink from 'components/button-link'
import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import { IconCheckCircleFill16 } from '@hashicorp/flight-icons/svg-react/check-circle-fill-16'
import { useCollectionProgress } from 'hooks/progress'
import { Collection } from 'lib/learn-client/types'
import { parseCollectionProgress } from './helpers'
import ProgressBar from 'components/progress-bar'
import s from './collection-meta-progress.module.css'

function CollectionMetaProgress({ collection }: { collection: Collection }) {
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
	const {
		completedTutorialCount,
		isCompleted,
		isInProgress,
		statusLabel,
		tutorialCount,
		tutorialCta,
	} = useMemo(
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
			<div className={s.statusSection}>
				{isCompleted ? (
					// TODO: split this out as a separate component within this file
					<div className={s.completeIconAndLabel}>
						<IconCheckCircleFill16 className={s.completeIcon} />
						<div className={s.statusLabel}>{statusLabel}</div>
					</div>
				) : (
					// TODO: split this out as a separate component within this file
					<div className={s.countIconAndLabel}>
						<IconCollections16 className={s.countIcon} />
						<div className={s.statusLabel}>{statusLabel}</div>
					</div>
				)}
				{isInProgress ? (
					<ProgressBar
						percentDone={(completedTutorialCount / tutorialCount) * 100}
					/>
				) : null}
			</div>
		</div>
	)
}

export default CollectionMetaProgress
