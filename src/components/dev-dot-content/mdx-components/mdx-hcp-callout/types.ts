import { HcpProductSlug } from 'types/products'

export type SolutionOption =
	| 'applications'
	| 'infrastructure'
	| 'networking'
	| 'security'

export interface HCPCalloutProps {
	product: HcpProductSlug
}
