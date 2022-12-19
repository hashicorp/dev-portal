import { IconCollections16 } from '@hashicorp/flight-icons/svg-react/collections-16'
import {
	CardDescription,
	CardEyebrow,
	CardEyebrowText,
	CardFooter,
	CardLogo,
	CardTitle,
} from 'components/card/components'
import CardLink from 'components/card-link'
import { CardBadges } from 'components/tutorial-collection-cards'
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
		<CardLink ariaLabel={heading} href={url}>
			<div className={s.root}>
				<div>
					<CardEyebrow>
						{eyebrowSlot || (
							<>
								<IconCollections16 />
								<CardEyebrowText>{eyebrowText}</CardEyebrowText>
							</>
						)}
					</CardEyebrow>
					{hasLogo ? (
						<CardLogo>
							<CompanyLogo name={logo} />
						</CardLogo>
					) : (
						<CardTitle text={heading} />
					)}
					<CardDescription text={description} />
				</div>
				<CardFooter>
					<CardBadges badges={productsUsed} />
				</CardFooter>
			</div>
		</CardLink>
	)
}

export { CompanyLogoOption, CollectionCardWithAuthElements }
export type { CollectionCardProps, CollectionCardPropsWithId }
export default CollectionCard
