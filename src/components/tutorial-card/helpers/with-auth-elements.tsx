import { AUTH_ENABLED } from 'hooks/use-authentication'
import { useTutorialProgress } from 'hooks/progress'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import TutorialCard, { TutorialCardPropsWithId } from '..'
import s from './with-auth-elements.module.css'
import { TutorialProgressStatus } from 'lib/learn-client/types'
import {
	progressStatusToPercent,
	progressStatusToLabel,
	progressStatusToAriaLabel,
} from 'lib/learn-client/api/progress'

/**
 * Displays a TutorialCard, which shows additional user-data-specific elements
 * for authenticated users.
 */
export function TutorialCardWithAuthElements(props: TutorialCardPropsWithId) {
	const { id: tutorialId, collectionId, ...rest } = props

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
	const meetsProgressThreshold =
		parseInt(progressStatusToPercent(tutorialProgressStatus)) >=
		parseInt(progressStatusToPercent(TutorialProgressStatus.in_progress))
	const shouldRenderProgress = isProgressLoaded && meetsProgressThreshold

	return (
		<TutorialCard
			{...rest}
			eyebrowSlotAriaLabel={
				shouldRenderProgress
					? progressStatusToAriaLabel(tutorialProgressStatus)
					: undefined
			}
			eyebrowSlot={
				<>
					<span>
						{shouldRenderProgress ? (
							<span className={s.progressIconAndLabel}>
								<span className={s.progressIcon}>ICON</span>
								<span className={s.progressLabel}>
									{progressStatusToLabel(tutorialProgressStatus)}
								</span>
							</span>
						) : (
							<span>{props.duration}</span>
						)}
					</span>
					{/** Hide from prod until auth is enabled */}
					{AUTH_ENABLED ? (
						<TutorialCardBookmarkButton
							tutorial={{ id: tutorialId, name: props.heading }}
						/>
					) : null}
				</>
			}
		/>
	)
}
