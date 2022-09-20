import { render } from '@testing-library/react'
import { ProductSlug } from 'types/products'

import ProductNav from '.'

describe('ProductNav', () => {
	describe('notice', () => {
		let products: { slug: ProductSlug; isBeta: boolean }[]

		it('should be displayed if not all products are in beta', () => {
			products = [
				{ slug: 'boundary', isBeta: true },
				{ slug: 'waypoint', isBeta: false },
			]

			const { container } = render(
				<ProductNav
					notice="At least one product is not yet in-beta"
					products={products}
				/>
			)

			expect(container).toHaveTextContent(
				'At least one product is not yet in-beta'
			)
		})

		it('should not be displayed if all products are in beta', () => {
			products = [
				{ slug: 'boundary', isBeta: true },
				{ slug: 'waypoint', isBeta: true },
			]

			const { container } = render(
				<ProductNav
					notice="At least one product is not yet in-beta"
					products={products}
				/>
			)

			expect(container).not.toHaveTextContent(
				'At least one product is not yet in-beta'
			)
		})
	})
})
