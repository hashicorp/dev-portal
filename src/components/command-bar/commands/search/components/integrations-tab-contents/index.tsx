import { useMemo } from 'react'
import { useCommandBar } from 'components/command-bar'
import { useIntegrationsByProductSlugs } from 'hooks/integrations/use-integrations-by-product-slugs'
import { Integration } from 'lib/integrations-api-client/integration'
import { IntegrationsTabContentsProps } from './types'

const IntegrationsTabContents = ({
	currentProductTag,
}: IntegrationsTabContentsProps) => {
	const { currentInputValue } = useCommandBar()
	const { integrations } = useIntegrationsByProductSlugs({
		productSlugs: currentProductTag
			? [currentProductTag]
			: __config.dev_dot.product_slugs_with_integrations,
	})

	const filteredIntegrations = useMemo(() => {
		return integrations.filter((integration: Integration) => {
			return integration.name
				.toLowerCase()
				.includes(currentInputValue.toLowerCase())
		})
	}, [currentInputValue, integrations])

	return (
		<>
			{filteredIntegrations.map((integration: Integration) => (
				<p key={integration.id}>{integration.name}</p>
			))}
		</>
	)
}

export type { IntegrationsTabContentsProps }
export default IntegrationsTabContents
