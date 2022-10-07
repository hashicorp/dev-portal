import { AUTH_ENABLED } from 'hooks/use-authentication'
import { useTutorialProgress } from 'hooks/progress'
import { progressStatusToAriaLabel } from 'lib/learn-client/api/progress'
import { TutorialProgressStatus } from 'lib/learn-client/types'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import { CardEyebrowText } from 'components/card/components'
import TutorialCard, { TutorialCardPropsWithId } from '..'
import ProgressIconAndLabel from '../components/progress-icon-and-label'
import { getSpeakableDuration } from './build-aria-label'

/**
 * Displays a TutorialCard, which shows additional user-data-specific elements
 * for authenticated users.
 */
export function TutorialCardWithAuthElements({
	id: tutorialId,
	collectionId,
	BookmarkButtonComponent = TutorialCardBookmarkButton,
	...restProps
}: TutorialCardPropsWithId) {
	/**
	 * Get tutorial progress. Will be undefined if not authenticated.
	 * Note as well that useTutorialProgress depends on AUTH_ENABLED.
	 */
	const { tutorialProgressStatus } = useTutorialProgress({
		tutorialId,
		collectionId,
	})

	/**
	 * Determine whether to render progress status.
	 * We only show progress for at a minimum state of `in_progress`.
	 */
	const isProgressLoaded = typeof tutorialProgressStatus !== 'undefined'
	const meetsProgressThreshold = [
		TutorialProgressStatus.in_progress,
		TutorialProgressStatus.complete,
	].includes(tutorialProgressStatus)
	const shouldRenderProgress = isProgressLoaded && meetsProgressThreshold

	return (
		<TutorialCard
			{...restProps}
			eyebrowSlotAriaLabel={
				shouldRenderProgress
					? progressStatusToAriaLabel(tutorialProgressStatus)
					: getSpeakableDuration(restProps.duration)
			}
			eyebrowSlot={
				<>
					{/** Progress is only queried if auth is enabled */}
					{shouldRenderProgress ? (
						<ProgressIconAndLabel status={tutorialProgressStatus} />
					) : (
						<CardEyebrowText>{restProps.duration}</CardEyebrowText>
					)}
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<BookmarkButtonComponent
							tutorial={{ id: tutorialId, name: restProps.heading }}
						/>
					) : null}
				</>
			}
		/>
	)
}
