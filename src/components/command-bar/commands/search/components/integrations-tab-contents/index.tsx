import { useMemo } from 'react'
import { IconPipeline16 } from '@hashicorp/flight-icons/svg-react/pipeline-16'
import { useIntegrationsByProductSlugs } from 'hooks/integrations/use-integrations-by-product-slugs'
import { getFilteredIntegrations } from 'views/product-integrations-landing/components/searchable-integrations-list/helpers/get-filtered-integrations'
import { useCommandBar } from 'components/command-bar'
import CustomHitsContainer from '../custom-hits-container'
import NoResultsMessage from '../no-results-message'
import TabContentsCta from '../tab-contents-cta'
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
		return getFilteredIntegrations({
			integrations: integrations ?? [],
			filterQuery: currentInputValue,
		})
	}, [currentInputValue, integrations])

	return (
		<>
			<CustomHitsContainer
				integrationsHits={filteredIntegrations}
				type="integrations"
				noResultsSlot={<NoResultsMessage />}
			/>
			{currentProductTag ? (
				<TabContentsCta
					href={`/${currentProductTag.id}/integrations`}
					icon={<IconPipeline16 />}
					text={`See all ${currentProductTag.text} integrations`}
				/>
			) : null}
		</>
	)
}

export type { IntegrationsTabContentsProps }
export default IntegrationsTabContents
