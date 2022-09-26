import { HcpProductSlug } from 'types/products'

export type SolutionOption =
	| 'applications'
	| 'infrastructure'
	| 'networking'
	| 'security'

export interface MdxHcpCalloutProps {
	product: HcpProductSlug
}
