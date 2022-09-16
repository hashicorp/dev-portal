import { HcpProductName } from 'types/products'

export type SolutionOption = 'infrastructure' | 'networking' | 'security'

export interface MdxHcpCalloutProps {
	product: HcpProductName
}
