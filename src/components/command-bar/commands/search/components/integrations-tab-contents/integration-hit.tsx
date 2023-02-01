import { CommandBarLinkListItem } from 'components/command-bar/components'
import { IntegrationHitObject, IntegrationHitProps } from './types'

/**
 * @TODO
 *
 * - render correct url
 * - render badge for `product`
 * - render trailing icon for external URLs
 */
const IntegrationHit = ({ hit }: IntegrationHitProps) => {
	return (
		<CommandBarLinkListItem
			title={hit.name}
			description={hit.description}
			url="/"
		/>
	)
}

export type { IntegrationHitObject, IntegrationHitProps }
export default IntegrationHit
