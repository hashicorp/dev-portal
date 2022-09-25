import { Hit } from '@algolia/client-search'
import { CommandBarTag } from 'components/command-bar/types'

interface TutorialsTabContentsProps {
	currentProductTag?: CommandBarTag
	tutorialLibraryCta: {
		href: string
		text: string
	}
}

type TutorialHitObject = Hit<{
	description: string
	name: string
}> & {
	defaultContext: {
		slug: string
	}
	id: string
	products: string[]
	slug: string
}

interface TutorialHitProps {
	hit: TutorialHitObject
}

export type { TutorialHitObject, TutorialHitProps, TutorialsTabContentsProps }
