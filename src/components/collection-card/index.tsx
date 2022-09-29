import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import CardLink from 'components/card-link'
import {
	CardEyebrow,
	CardHeading,
	CardBody,
	CardBadges,
} from 'components/tutorial-collection-cards'
import CollectionCardWithAuthElements from './components/with-auth-elements'
import {
	CollectionCardProps,
	CollectionCardPropsWithId,
	CompanyLogoOption,
} from './types'
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
	eyebrowSlot,
}: CollectionCardProps) {
	const hasLogo = Boolean(logo)
	const eyebrowText = `${tutorialCount} tutorial${
		tutorialCount !== 1 ? 's' : ''
	}`
	return (
		<CardLink ariaLabel={heading} href={url} className={s.root}>
			<CardEyebrow>
				{eyebrowSlot || (
					<>
						<IconCollections16 />
						<span>{eyebrowText}</span>
					</>
				)}
			</CardEyebrow>
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

export { CompanyLogoOption, CollectionCardWithAuthElements }
export type { CollectionCardProps, CollectionCardPropsWithId }
export default CollectionCard
