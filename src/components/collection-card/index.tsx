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

/**
 * Render a card that links to a collection.
 *
 * TODO: note that not all collection links will work, for now.
 * This is because not all product collections are in dev-dot, yet.
 * Asana task to address:
 * https://app.asana.com/0/1201987349274776/1201991101510148
 */
function CollectionCard({
  url,
  logo,
  tutorialCount,
  heading,
  description,
  productsUsed,
}: CollectionCardProps) {
  return (
    <CardLink href={url} className={s.root}>
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
