import { AUTH_ENABLED } from 'hooks/use-authentication'
import { TutorialCardBookmarkButton } from 'components/bookmark-button'
import CardLink from 'components/card-link'
import {
	CardEyebrow,
	CardHeading,
	CardBody,
	CardBadges,
	CardBadgeOption,
} from 'components/tutorial-collection-cards'
import { buildAriaLabel } from './helpers'
import { TutorialCardProps, TutorialCardPropsWithId } from './types'
import s from './tutorial-card.module.css'

/**
 * Render a card that links to a tutorial.
 */
function TutorialCard({
	url,
	duration,
	heading,
	description,
	productsUsed,
	hasVideo,
	hasInteractiveLab,
	isBookmarked = false,
}: TutorialCardProps) {
	/**
	 * Build the array of badges to show at the bottom of the card.
	 * Note: may be empty.
	 */
	const badges: CardBadgeOption[] = [...productsUsed]
	if (hasInteractiveLab) {
		badges.push('interactive')
	}
	if (hasVideo) {
		badges.push('video')
	}

	const ariaLabel = buildAriaLabel({
		heading,
		duration,
		productsUsed,
		hasVideo,
		hasInteractiveLab,
	})

	return (
		<CardLink href={url} className={s.root} ariaLabel={ariaLabel}>
			<CardEyebrow className={s.eyebrow}>
				<span>{duration}</span>
				{/** // NOTE! - hiding this component from prod until auth is enabled  */}
				{AUTH_ENABLED ? (
					<TutorialCardBookmarkButton isBookmarked={isBookmarked} />
				) : null}
			</CardEyebrow>
			<CardHeading level={3} text={heading} />
			<CardBody text={description} />
			<CardBadges badges={badges} />
		</CardLink>
	)
}

export type { TutorialCardProps, TutorialCardPropsWithId }
export default TutorialCard
