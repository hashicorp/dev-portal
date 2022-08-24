import {
	useInstantSearch,
	useRefinementList,
} from 'react-instantsearch-hooks-web'
import classNames from 'classnames'

import { productSlugsToNames } from 'lib/products'

import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'

import productFilterStyle from './product-filter.module.css'
import { FilterSection } from '../filter-section'
import { VALID_PRODUCT_SLUGS_FOR_FILTERING } from 'views/tutorial-library/constants'

export function ProductFilter() {
	const { refine } = useRefinementList({
		attribute: 'products',
		operator: 'and',
	})

	const { indexUiState } = useInstantSearch()
	const selectedProducts = indexUiState?.refinementList?.products ?? []

	return (
		<FilterSection heading="Product">
			{VALID_PRODUCT_SLUGS_FOR_FILTERING.map((slug) => {
				const isProductSelected = selectedProducts.includes(slug)

				const productName = productSlugsToNames[slug]

				const inputId = `filter-${slug}`

				return (
					<li key={slug}>
						<label htmlFor={inputId} className={productFilterStyle.option}>
							<input
								type="checkbox"
								id={inputId}
								checked={isProductSelected}
								onChange={() => {
									refine(slug)
								}}
							/>
							<ProductIcon
								productSlug={slug as ProductSlug}
								className={classNames(
									productFilterStyle.icon,
									isProductSelected && productFilterStyle.active
								)}
							/>
							{productName}
						</label>
					</li>
				)
			})}
		</FilterSection>
	)
}
