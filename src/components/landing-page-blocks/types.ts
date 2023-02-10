import {
	CalloutCardBlockProps,
	CardGridBlockProps,
	CollectionCardGridBlockProps,
	IconCardGridBlockProps,
	TutorialCardGridBlockProps,
} from './components'

interface CalloutCardLandingPageBlock extends CalloutCardBlockProps {
	type: 'callout'
}

interface CardGridLandingPageBlock extends CardGridBlockProps {
	type: 'card-grid'
}

interface CollectionCardGridLandingPageBlock
	extends CollectionCardGridBlockProps {
	type: 'collection-card-grid'
}

interface GettingStartedCardLandingPageBlock {
	type: 'getting-started-card'
	description: CalloutCardBlockProps['body']
	callToAction: CalloutCardBlockProps['ctas'][0]
}

interface IconCardGridLandingPageBlock extends IconCardGridBlockProps {
	type: 'icon-card-grid'
}

interface TutorialCardGridLandingPageBlock extends TutorialCardGridBlockProps {
	type: 'tutorial-card-grid'
}

type LandingPageBlock =
	| CalloutCardLandingPageBlock
	| CardGridLandingPageBlock
	| CollectionCardGridLandingPageBlock
	| GettingStartedCardLandingPageBlock
	| IconCardGridLandingPageBlock
	| TutorialCardGridLandingPageBlock

interface LandingPageBlocksProps {
	blocks: LandingPageBlock[]
}

export type {
	CalloutCardLandingPageBlock,
	CardGridLandingPageBlock,
	CollectionCardGridLandingPageBlock,
	GettingStartedCardLandingPageBlock,
	IconCardGridLandingPageBlock,
	TutorialCardGridLandingPageBlock,
	LandingPageBlock,
	LandingPageBlocksProps,
}
