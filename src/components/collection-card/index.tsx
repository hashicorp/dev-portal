import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import classNames from 'classnames'
import CardLink from 'components/card-link'
import {
  CardEyebrow,
  CardHeading,
  CardBody,
  CardBadges,
} from 'components/tutorial-collection-cards'
import { CollectionCardProps } from './types'
import CompanyLogo from './components/company-logo'
import s from './collection-card.module.css'

/**
 * Render a card that links to a collection.
 */
function CollectionCard({
  url,
  logo,
  tutorialCount,
  heading,
  description,
  productsUsed,
}: CollectionCardProps) {
  const hasLogo = Boolean(logo)
  return (
    <CardLink href={url} className={s.root}>
      <CardEyebrow
        icon={<IconCollections16 />}
        text={`${tutorialCount} tutorial${tutorialCount !== 1 ? 's' : ''}`}
      />
      {hasLogo && (
        <span className={s.logoContainer}>
          <CompanyLogo name={logo} />
        </span>
      )}
      <CardHeading level={3} text={heading} screenReaderOnly={hasLogo} />
      <CardBody text={description} />
      <CardBadges badges={productsUsed} />
    </CardLink>
  )
}

export default CollectionCard
