import { render, screen } from '@testing-library/react'
import { ProductBadge } from '../product-badge'

describe('<ProductBadge />', () => {
	it('should render the name of the product', () => {
		const productName = 'waypoint'
		render(<ProductBadge productName={productName} />)
		const productBadgeEl = screen.getByText(productName)
		expect(productBadgeEl).toBeInTheDocument()
	})
})
