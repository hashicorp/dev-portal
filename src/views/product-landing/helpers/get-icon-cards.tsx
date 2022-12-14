import { IconApi16 } from '@hashicorp/flight-icons/svg-react/api-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ENABLED_INTEGRATION_PRODUCTS } from 'lib/enabled-integration-products'
import { ProductSlug } from 'types/products'

export function getIconCards(productSlug: ProductSlug) {
	const iconCards = [
		{
			icon: <IconDocs16 />,
			text: 'Documentation',
			url: `/${productSlug}/docs`,
		},
		{
			icon: <IconLearn16 />,
			text: 'Tutorials',
			url: `/${productSlug}/tutorials`,
		},
	]
	if (productSlug !== 'hcp') {
		iconCards.push({
			icon: <IconDownload16 />,
			text: 'Install',
			url: `/${productSlug}/downloads`,
		})
	}

	// Add Integrations card if it's enabled for this product
	if (ENABLED_INTEGRATION_PRODUCTS.includes(productSlug)) {
		iconCards.push({
			icon: <IconApi16 />,
			text: 'Integrations',
			url: `/${productSlug}/integrations`,
		})
	}

	return iconCards
}
