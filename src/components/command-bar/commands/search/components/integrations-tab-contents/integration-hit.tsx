import { CommandBarLinkListItem } from 'components/command-bar/components'
import { productSlugsToNames } from 'lib/products'
import { getHrefForIntegration } from 'views/product-integrations-landing/components/integrations-list/helpers/get-href-for-integration'
import { IntegrationHitObject, IntegrationHitProps } from './types'

const IntegrationHit = ({ hit }: IntegrationHitProps) => {
	const url = getHrefForIntegration(hit)
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
