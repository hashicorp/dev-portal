import { CommandBarLinkListItem } from 'components/command-bar/components'
import { getIntegrationUrl } from 'lib/integrations'
import { productSlugsToNames } from 'lib/products'
import { IntegrationHitObject, IntegrationHitProps } from './types'

const IntegrationHit = ({ hit }: IntegrationHitProps) => {
	const url = getIntegrationUrl(hit)
	return (
		<CommandBarLinkListItem
			description={hit.description}
			badges={[productSlugsToNames[hit.product.slug]]}
			title={hit.name}
			url={url}
		/>
	)
}

export type { IntegrationHitObject, IntegrationHitProps }
export default IntegrationHit
