import {
	useInstantSearch,
	useRefinementList,
} from 'react-instantsearch-hooks-web'

import { productSlugsToNames } from 'lib/products'

import ProductIcon from 'components/product-icon'
import { ProductSlug } from 'types/products'

import productFilterStyle from './product-filter.module.css'
import { FilterSection } from '../filter-section'
import { VALID_PRODUCT_SLUGS_FOR_FILTERING } from 'views/tutorial-library/constants'
import { CheckboxField } from 'components/form/field-controls'

export function ProductFilter({ refine, selectedProducts }) {
	return (
		<FilterSection heading="Product">
			{VALID_PRODUCT_SLUGS_FOR_FILTERING.map((slug) => {
				const isProductSelected = selectedProducts.includes(slug)

				const productName = productSlugsToNames[slug]

				const inputId = `filter-${slug}`

				return (
					<li key={slug}>
						<CheckboxField
							id={inputId}
							checked={isProductSelected}
							onChange={() => {
								refine(slug)
							}}
							labelFontWeight="regular"
							label={
								<>
									<ProductIcon
										productSlug={slug as ProductSlug}
										className={productFilterStyle.icon}
									/>
									{productName}
								</>
							}
						/>
					</li>
				)
			})}
		</FilterSection>
	)
}
