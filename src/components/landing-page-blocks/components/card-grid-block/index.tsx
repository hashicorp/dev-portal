import { CardTitle, CardDescription } from 'components/card/components'
import CardLink from 'components/card-link'
import CardsGridList from 'components/cards-grid-list'
import Text from 'components/text'
import { AutosizedHeadingBlock } from '..'
import { CardGridBlockCard, CardGridBlockProps } from './types'
import s from './card-grid-block.module.css'

const CardGridBlock = ({
	cards,
	description,
	title,
	headingId,
	headingLevel,
}: CardGridBlockProps) => {
	const hasTitle = Boolean(title)
	const hasDescription = Boolean(description)

	return (
		<div className={s.root}>
			{hasTitle && (
				<AutosizedHeadingBlock
					level={headingLevel}
					id={headingId}
					text={title}
				/>
			)}
			{hasDescription && (
				<Text className={s.description} size={300} weight="regular">
					{description}
				</Text>
			)}
			<CardsGridList>
				{cards.map(({ description, title, url }: CardGridBlockCard) => (
					<CardLink
						key={url}
						ariaLabel={title}
						className={s.cardsGridListCardLink}
						href={url}
					>
						<CardTitle text={title} />
						<CardDescription text={description} />
					</CardLink>
				))}
			</CardsGridList>
		</div>
	)
}

export type { CardGridBlockCard, CardGridBlockProps }
export { CardGridBlock }
