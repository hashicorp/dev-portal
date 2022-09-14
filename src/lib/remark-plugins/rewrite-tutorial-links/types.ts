import { ProductOption } from 'lib/learn-client/types'

type SplitLearnPath = [
	string, // the leading slash
	'collections' | 'tutorials',
	ProductOption,
	string
]

export type { SplitLearnPath }
