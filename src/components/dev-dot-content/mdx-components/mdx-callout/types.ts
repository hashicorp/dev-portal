import { ProductOption } from 'lib/learn-client/types'

export type SolutionOption = 'infrastructure' | 'networking' | 'security'

export interface MdxCalloutProps {
	product: ProductOption
	solutionGroup: SolutionOption
	// heading: string
	// subheading?: string
}
