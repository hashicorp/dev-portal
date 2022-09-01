import { IconGuide16 } from '@hashicorp/flight-icons/svg-react/guide-16'
import { Product, ProductData } from 'types/products'
import { products } from 'lib/products'
import { SuggestedPage } from '../../suggested-pages-list'
import suggestedPages from '../data/suggested-pages.json'
import ProductIcon from 'components/product-icon'

const getSuggestedPages = (product?: ProductData): SuggestedPage[] => {
	if (product) {
		return suggestedPages[product.slug]
	}

	const defaultList: SuggestedPage[] = []

	// Built default list from products, other than sentinel
	products.forEach((product: Product) => {
		if (product.slug === 'sentinel') {
			return
		}

		defaultList.push({
			icon: <ProductIcon productSlug={product.slug} />,
			text: product.name,
			url: `/${product.slug}`,
		})
	})

	// Add an item for the tutorial library
	defaultList.push({
		icon: <IconGuide16 />,
		text: 'Tutorial Library',
		url: '/tutorial-library',
	})

	return defaultList
}

export { getSuggestedPages }
