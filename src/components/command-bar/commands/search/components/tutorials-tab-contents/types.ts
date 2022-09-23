import { CommandBarTag } from 'components/command-bar/types'

interface TutorialsTabContentsProps {
	currentProductTag?: CommandBarTag
	tutorialLibraryCta: {
		href: string
		text: string
	}
}

interface TutorialHitObject extends Record<string, unknown> {
	_highlightResult: {
		description: {
			value: string
		}
		name: {
			value: string
		}
	}
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
