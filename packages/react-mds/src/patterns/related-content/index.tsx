import { Card } from '../../components/card'
import classNames from 'classnames'
import Link from 'next/link'
import type { RelatedContentProps } from './types'
import s from './style.module.css'

const RelatedContent = ({
	appearance = 'transparent',
	headline,
	description,
	cards,
	cta,
}: RelatedContentProps) => {
	return (
		<div
			className={classNames(s.root, s[appearance], {
				['mds-dark-mode']: appearance === 'dark',
			})}
		>
			<div className={s.wrapper}>
				<div className={s.textStack}>
					<h2 className={s.headline}>{headline}</h2>
					{description ? <p className={s.description}>{description}</p> : null}
				</div>
				<div className={s.cards} data-testid="wpl-cards-container">
					{cards.map((card, i) => (
						<Card
							key={i}
							href={card.link}
							content={{
								...(card.thumbnail && {
									thumbnail: {
										alt: card.thumbnail.alt,
										src: card.thumbnail.src,
										aspectRatio: '16/9',
									},
								}),
								eyebrow: card.meta,
								heading: card.heading,
								description: card.description,
								showArrow: true,
							}}
						/>
					))}
				</div>

				{cta ? (
					<div className={s.cta} data-testid="wpl-cta-container">
						<Link href={cta.href} legacyBehavior>
							{cta.text}
						</Link>
					</div>
				) : null}
			</div>
		</div>
	)
}

export { RelatedContent }
