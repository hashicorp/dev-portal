import { CommandBarLinkListItem } from 'components/command-bar/components'
import { productSlugsToNames } from 'lib/products'
import { IntegrationHitObject, IntegrationHitProps } from './types'

/**
 * @TODO
 *
 * - render correct url
 * - render trailing icon for external URLs
 */
const IntegrationHit = ({ hit }: IntegrationHitProps) => {
	return (
		<CommandBarLinkListItem
			description={hit.description}
			badges={[productSlugsToNames[hit.product.slug]]}
			title={hit.name}
			url="/"
		/>
	)
}

export type { IntegrationHitObject, IntegrationHitProps }
export default IntegrationHit
