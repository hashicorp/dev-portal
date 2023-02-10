import { CardTitle, CardDescription } from 'components/card/components'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import { CardGridBlockCard, CardGridBlockProps } from './types'
import { Section } from '../section'

const CardGridBlock = ({ heading, subheading, cards }: CardGridBlockProps) => {
	return (
		<Section heading={heading} subheading={subheading}>
			<CardsGridList>
				{cards.map(({ description, title, url }: CardGridBlockCard) => (
					<CardLink key={url} ariaLabel={title} href={url}>
						<CardTitle text={title} />
						<CardDescription text={description} />
					</CardLink>
				))}
			</CardsGridList>
		</Section>
	)
}

export type { CardGridBlockCard, CardGridBlockProps }
export { CardGridBlock }
