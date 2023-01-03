import { CertificationsHero } from 'views/certifications/components'
import Text from 'components/text'
import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image-outlined.svg'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { CertificationsSectionProps } from './types'
import {
	CollectionCardPropsWithId,
	CollectionCardWithAuthElements,
} from 'components/collection-card'
import { ReactNode } from 'react'
import s from './certifications-section.module.css'
import CardsGridList from 'components/cards-grid-list'

function HomePageMaxWidth({ children }: { children: ReactNode }) {
	return <div className={s.homePageMaxWidth}>{children}</div>
}

function CertificationsSection({
	heading,
	description,
	collectionCards,
}: CertificationsSectionProps) {
	return (
		<>
			<CertificationsHero
				backgroundClassName={s.heroBackground}
				startSlot={
					<>
						<h2 className={s.heading}>{heading}</h2>
						<div className={s.introDescription}>
							{description.map((paragraphText: string, idx: number) => {
								return (
									/**
									 * Content is stable & won't be re-ordered on client,
									 * so should be fine to use index as key.
									 */
									// eslint-disable-next-line react/no-array-index-key
									<Text key={idx} size={300}>
										{paragraphText}
									</Text>
								)
							})}
						</div>
						<StandaloneLink
							href="/certifications"
							text="View all certifications"
							icon={<IconArrowRight16 />}
							iconPosition="trailing"
						/>
					</>
				}
				endSlot={
					<div className={s.heroImage}>
						<Image alt="" src={svgHeroImage} width={447} height={515} />
					</div>
				}
			/>
			<div className={s.tutorials}>
				<HomePageMaxWidth>
					<CardsGridList fixedColumns={2}>
						{collectionCards.map((cardProps: CollectionCardPropsWithId) => {
							const { id } = cardProps
							return <CollectionCardWithAuthElements key={id} {...cardProps} />
						})}
					</CardsGridList>
				</HomePageMaxWidth>
			</div>
		</>
	)
}

export { CertificationsSection }
