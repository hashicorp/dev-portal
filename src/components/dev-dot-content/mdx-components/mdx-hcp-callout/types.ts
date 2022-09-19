import { HcpProductSlug } from 'types/products'

export type SolutionOption = 'infrastructure' | 'networking' | 'security'

export interface MdxHcpCalloutProps {
	product: HcpProductSlug
}
