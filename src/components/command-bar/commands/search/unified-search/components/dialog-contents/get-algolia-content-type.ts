import { SearchableContentType } from 'contexts'

export function getAlgoliaContentType(
	inputType: SearchableContentType | 'all'
): 'docs' | 'tutorial' | 'integration' | null {
	return inputType === 'integrations'
		? 'integration'
		: inputType === 'tutorials'
		? 'tutorial'
		: inputType === 'docs'
		? 'docs'
		: undefined
}
