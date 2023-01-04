import { CertificationsSectionProps } from './types'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import CardsGridList from 'components/cards-grid-list'
import { CertificationsTextAndImage } from './components/certifications-text-and-image'
import s from './certifications-section.module.css'

/**
 * Render a section with a link to certifications content,
 * and render some collection cards related to certifications.
 */
function CertificationsSection({
	heading,
	description,
	collectionCards,
	link,
}: CertificationsSectionProps) {
	return (
		<>
			<CertificationsTextAndImage
				heading={heading}
				description={description}
				link={link}
			/>
			<div className={s.collectionCards}>
				<CardsGridList fixedColumns={2}>
					{collectionCards.map((cardProps: CollectionCardPropsWithId) => {
						return (
							<CollectionCardWithAuthElements
								key={cardProps.id}
								{...cardProps}
							/>
						)
					})}
				</CardsGridList>
			</div>
		</>
	)
}

export { CertificationsSection }
