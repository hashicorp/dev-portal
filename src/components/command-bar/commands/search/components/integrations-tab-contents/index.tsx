import { useMemo } from 'react'
import { useIntegrationsByProductSlugs } from 'hooks/integrations/use-integrations-by-product-slugs'
import { Integration } from 'lib/integrations-api-client/integration'
import { useCommandBar } from 'components/command-bar'
import CustomHitsContainer from '../custom-hits-container'
import NoResultsMessage from '../no-results-message'
import { IntegrationsTabContentsProps } from './types'

const IntegrationsTabContents = ({
	currentProductTag,
}: IntegrationsTabContentsProps) => {
	const { currentInputValue } = useCommandBar()
	const { integrations } = useIntegrationsByProductSlugs({
		productSlugs: currentProductTag
			? [currentProductTag.id]
			: __config.dev_dot.product_slugs_with_integrations,
	})

	const filteredIntegrations = useMemo(() => {
		return integrations?.filter((integration: Integration) => {
			return integration.name
				.toLowerCase()
				.includes(currentInputValue.toLowerCase())
		})
	}, [currentInputValue, integrations])

	return (
		<CustomHitsContainer
			integrationsHits={filteredIntegrations}
			type="integrations"
			noResultsSlot={<NoResultsMessage />}
		/>
	)
}

export type { IntegrationsTabContentsProps }
export default IntegrationsTabContents
