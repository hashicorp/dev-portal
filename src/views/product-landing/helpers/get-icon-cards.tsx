import { IconDocs16 } from '@hashicorp/flight-icons/svg-react/docs-16'
import { IconLearn16 } from '@hashicorp/flight-icons/svg-react/learn-16'
import { IconDownload16 } from '@hashicorp/flight-icons/svg-react/download-16'
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

	return iconCards
}
