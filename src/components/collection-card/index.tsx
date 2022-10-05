import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import CardLink from 'components/card-link'
import { CardEyebrow, CardBadges } from 'components/tutorial-collection-cards'
import CollectionCardWithAuthElements from './components/with-auth-elements'
import {
	CollectionCardProps,
	CollectionCardPropsWithId,
	CompanyLogoOption,
} from './types'
import CompanyLogo from './components/company-logo'

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
		<CardLink
			ariaLabel={heading}
			description={description}
			eyebrow={
				<CardEyebrow>
					{eyebrowSlot || (
						<>
							<IconCollections16 />
							<span>{eyebrowText}</span>
						</>
					)}
				</CardEyebrow>
			}
			footer={<CardBadges badges={productsUsed} />}
			href={url}
			logo={hasLogo ? <CompanyLogo name={logo} /> : undefined}
			title={heading}
		/>
	)
}

export { CompanyLogoOption, CollectionCardWithAuthElements }
export type { CollectionCardProps, CollectionCardPropsWithId }
export default CollectionCard
