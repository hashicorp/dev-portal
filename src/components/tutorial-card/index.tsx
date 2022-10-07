import CardLink from 'components/card-link'
import {
	CardDescription,
	CardEyebrow,
	CardEyebrowText,
	CardFooter,
	CardTitle,
} from 'components/card/components'
import {
	CardBadges,
	CardBadgeOption,
} from 'components/tutorial-collection-cards'
import {
	buildAriaLabel,
	getSpeakableDuration,
	TutorialCardWithAuthElements,
} from './helpers'
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
	eyebrowSlot,
	eyebrowSlotAriaLabel = getSpeakableDuration(duration),
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
		eyebrowSlotAriaLabel,
	})

	return (
		<CardLink ariaLabel={ariaLabel} href={url}>
			<div className={s.root}>
				<div>
					<CardEyebrow className={s.eyebrow}>
						{eyebrowSlot || <CardEyebrowText>{duration}</CardEyebrowText>}
					</CardEyebrow>
					<CardTitle text={heading} />
					<CardDescription text={description} />
				</div>
				<CardFooter>
					<CardBadges badges={badges} />
				</CardFooter>
			</div>
		</CardLink>
	)
}

export type { TutorialCardProps, TutorialCardPropsWithId }
export { TutorialCardWithAuthElements }
export default TutorialCard
