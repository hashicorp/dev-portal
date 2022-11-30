import { Hit } from '@algolia/client-search'
import { CommandBarTag } from 'components/command-bar/types'
import { TutorialLite } from 'lib/learn-client/types'
import { LearnProductSlug } from 'types/products'

interface TutorialsTabContentsProps {
	currentProductTag?: CommandBarTag
	tutorialLibraryCta: {
		href: string
		text: string
	}
}

type TutorialHitObject = Hit<{
	description: string
	page_title: string
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
		products: LearnProductSlug[]
	}

interface TutorialHitProps {
	hit: TutorialHitObject
}

export type { TutorialHitObject, TutorialHitProps, TutorialsTabContentsProps }
