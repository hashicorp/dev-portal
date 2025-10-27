/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
import { IconTerminalScreen16 } from '@hashicorp/flight-icons/svg-react/terminal-screen-16'
import Badge from 'components/badge'
import {
	buildAriaLabel,
	getSpeakableDuration,
} from './helpers/build-aria-label'
import { TutorialCardProps } from './types'
import s from './tutorial-card.module.css'

/**
 * Render a card that links to a tutorial.
 */
export function TutorialCard({
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
		<CardLink ariaLabel={ariaLabel} href={url} className={s.tutorialCard}>
			<div className={s.root}>
				<div>
					<CardEyebrow className={s.eyebrow}>
						{hasInteractiveLab && (
							<Badge
								ariaLabel="Interactive"
								icon={<IconTerminalScreen16 />}
								size="small"
								className={s.interactiveEyebrowBadge}
							/>
						)}
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
