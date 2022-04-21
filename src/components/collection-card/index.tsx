import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import CardLink from 'components/card-link'
import {
  CardEyebrow,
  CardHeading,
  CardBody,
  CardBadges,
} from 'components/tutorial-collection-cards'
import { CollectionCardProps } from './types'
import s from './collection-card.module.css'

function CollectionCard({
  url,
  logo,
  tutorialCount,
  heading,
  description,
  productsUsed,
}: CollectionCardProps) {
  return (
    <CardLink href={url} className={s.tutorialCard}>
      <CardEyebrow
        icon={<IconCollections16 />}
        text={`${tutorialCount} tutorial${tutorialCount !== 1 ? 's' : ''}`}
      />
      <CardHeading level={3} text={heading} logo={logo} />
      <CardBody text={description} />
      <CardBadges badges={productsUsed} />
    </CardLink>
  )
}

export default CollectionCard
