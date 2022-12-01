import { Hit } from '@algolia/client-search'
import { CommandBarTag } from 'components/command-bar/types'
import {
	CollectionLevelOption,
	ProductOption,
	TutorialLite,
} from 'lib/learn-client/types'

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
	headings: string[]
}> &
	Pick<
		TutorialLite,
		| 'defaultContext'
		| 'id'
		| 'name'
		| 'slug'
		| 'description'
		| 'readTime'
		| 'edition'
	> & {
		hasVideo: boolean
		isInteractive: boolean
		products: ProductOption[]
		level: CollectionLevelOption
	}

interface TutorialHitProps {
	hit: TutorialHitObject
}

export type { TutorialHitObject, TutorialHitProps, TutorialsTabContentsProps }
