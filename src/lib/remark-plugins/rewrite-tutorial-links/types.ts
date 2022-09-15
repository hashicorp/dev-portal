import { ProductOption, SectionOption } from 'lib/learn-client/types'

type SplitLearnPath = [
	string, // the leading slash
	'collections' | 'tutorials',
	ProductOption | SectionOption,
	string
]

export type { SplitLearnPath }
