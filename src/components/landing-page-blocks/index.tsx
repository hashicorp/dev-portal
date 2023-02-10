/* eslint-disable react/jsx-key */

import { LandingPageBlock, LandingPageBlocksProps } from './types'
import {
	CalloutCardBlock,
	CardGridBlock,
	IconCardGridBlock,
	TutorialCardGridBlock,
	CollectionCardGridBlock,
} from './components'
import s from './landing-page-blocks.module.css'

const LandingPageBlocks = ({ blocks = [] }: LandingPageBlocksProps) => {
	return (
		<div className={s.stack}>
			{blocks.map((block: LandingPageBlock) => {
				const { type } = block

				if (type === 'callout') {
					return <CalloutCardBlock {...block} />
				}

				if (type === 'card-grid') {
					const { heading, subheading, cards } = block
					return (
						<CardGridBlock
							heading={heading}
							subheading={subheading}
							cards={cards}
						/>
					)
				}

				if (type === 'collection-card-grid') {
					const { heading, subheading, collections } = block
					return (
						<CollectionCardGridBlock
							heading={heading}
							subheading={subheading}
							collections={collections}
						/>
					)
				}

				if (type === 'tutorial-card-grid') {
					const { heading, subheading, tutorials } = block
					return (
						<TutorialCardGridBlock
							heading={heading}
							subheading={subheading}
							tutorials={tutorials}
						/>
					)
				}

				if (type === 'icon-card-grid') {
					const { heading, subheading, cards, productSlug } = block
					return (
						<IconCardGridBlock
							heading={heading}
							subheading={subheading}
							cards={cards}
							productSlug={productSlug}
						/>
					)
				}

				/**
				 * @TODO render error toast/message
				 */
				return null
			})}
		</div>
	)
}

export type { LandingPageBlock, LandingPageBlocksProps }
export default LandingPageBlocks
