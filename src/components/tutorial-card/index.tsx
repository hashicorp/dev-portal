import CardLink from 'components/card-link'
import { TutorialCardProps } from './types'
import {
  CardEyebrow,
  CardHeading,
  CardBody,
  CardBadges,
  CardBadgeOption,
} from 'components/tutorial-collection-cards'
import s from './tutorial-card.module.css'
import { buildAriaLabel } from './helpers'

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
      <CardEyebrow text={duration} />
      <CardHeading level={3} text={heading} />
      <CardBody text={description} />
      <CardBadges badges={badges} />
    </CardLink>
  )
}

export default TutorialCard
