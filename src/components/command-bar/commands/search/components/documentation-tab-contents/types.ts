import { SuggestedPagesProps } from '../suggested-pages/types'

interface DocumentationTabContentsProps {
	suggestedPages: SuggestedPagesProps['pages']
}

interface DocumentationHitObject extends Record<string, unknown> {
	objectID: string
	_highlightResult: {
		page_title: {
			value: string
		}
		description: {
			value: string
		}
	}
	product: string
}

interface DocumentationHitProps {
	hit: DocumentationHitObject
}

export type {
	DocumentationHitObject,
	DocumentationHitProps,
	DocumentationTabContentsProps,
}
