import { IconApi16 } from '@hashicorp/flight-icons/svg-react/api-16'
import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { ProductData } from 'types/products'

export function getIconCards(product: ProductData) {
	const iconCards = [
		{
			icon: <IconDocs16 />,
			text: 'Documentation',
			url: `/${product.slug}/docs`,
		},
		{
			icon: <IconLearn16 />,
			text: 'Tutorials',
			url: `/${product.slug}/tutorials`,
		},
	]
	if (product.slug !== 'hcp') {
		iconCards.push({
			icon: <IconDownload16 />,
			text: 'Install',
			url: `/${product.slug}/downloads`,
		})
	}

	// Add Integrations card if it's enabled for this product
	if (product.integrationsConfig.enabled) {
		console.log(product.integrationsConfig)
		iconCards.push({
			icon: <IconApi16 />,
			text: 'Integrations',
			url: `/${product.slug}/integrations`,
		})
	}

	return iconCards
}
