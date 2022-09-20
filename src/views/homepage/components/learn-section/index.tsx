import type { CSSProperties } from 'react'
import slugify from 'slugify'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CollectionCard, {
	CollectionCardWithAuthElements,
	CollectionCardPropsWithId,
} from 'components/collection-card'
import Text from 'components/text'
import Heading from 'components/heading'
import StandaloneLink from 'components/standalone-link'
import { LearnSectionProps } from './types'
import s from './learn-section.module.css'

export default function LearnSection({
	imageSrc,
	heading,
	description,
	collectionCards,
	link,
}: LearnSectionProps) {
	return (
		<section className={s.learnSection}>
			<div className={s.intro}>
				<div className={s.introInner}>
					<div className={s.introMedia}>
						<img src={imageSrc} />
					</div>
					<header className={s.introContent}>
						<Heading
							level={2}
							size={500}
							weight="bold"
							id={slugify(heading, { lower: true })}
						>
							{heading}
						</Heading>
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
							href={link.url}
							text={link.text}
							iconPosition="trailing"
							icon={<IconArrowRight16 />}
							color="secondary"
						/>
					</header>
				</div>
			</div>

			<div className={s.tutorials}>
				<ul
					className={s.tutorialsList}
					style={
						{
							'--collection-cards-count': collectionCards.length,
						} as CSSProperties
					}
				>
					{collectionCards.map((cardProps: CollectionCardPropsWithId) => {
						const { id } = cardProps
						return (
							<li key={id} className={s.tutorialsListItem}>
								<CollectionCardWithAuthElements {...cardProps} />
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
