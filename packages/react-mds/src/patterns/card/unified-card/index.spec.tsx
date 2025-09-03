import { render, screen } from '@testing-library/react'
import { UnifiedCard, UnifiedCardProps } from '../unified-card'

const defaultProps: UnifiedCardProps = {
	link: 'https://hashicorp.com',
	heading: 'Example heading',
	thumbnail: {
		src: 'https://www.datocms-assets.com/19447/1648680074-screenshot-2022-03-31-at-00-40-47.png',
		alt: 'HashiConf Europe 2022 Recap',
	},
} as const

describe(`<UnifiedCard />`, () => {
	it('should render the provided meta with a separator if n > 1', () => {
		const expectedMeta = ['Category', 'Hello']
		render(<UnifiedCard {...defaultProps} meta={expectedMeta} />)

		const metaElement = screen.getByTestId('wpl-card-meta')

		expectedMeta.forEach((item) => {
			expect(metaElement).toHaveTextContent(item)
		})

		expect(metaElement).toContainElement(screen.getByText('|'))
	})

	it('it should not render a separator if n === 1', () => {
		render(<UnifiedCard {...defaultProps} meta={['Category']} />)
		const metaElement = screen.getByTestId('wpl-card-meta')

		expect(metaElement).toContainElement(screen.getByText('Category'))

		expect(metaElement).not.toContainElement(screen.queryByText('|'))
	})
})
