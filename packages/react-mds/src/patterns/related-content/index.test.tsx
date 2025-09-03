import { render, screen } from '@testing-library/react'
import { RelatedContent } from '../related-content'

const defaultProps = {
	headline: 'Related Content',
	description:
		'Leo mauris fermentum pharetra blandit tellus euismod. Leo mauris fermentum pharetra blandit tellus euismod.',
	cards: [
		{
			link: 'https://hashicorp.com',
			meta: ['USE CASES'],
			heading:
				'Display 5 - 4 lines with character limit of 130. Leo mauris fermentum pharetra blandit tellus euismod…',
			description:
				'Body small - 4 lines with character limit of 170. Leo mauris fermentum pharetra blandit tellus euismod pharetra. Duis egestas volutpat dolor…',
		},
		{
			link: 'https://hashicorp.com',
			meta: ['USE CASES'],
			heading:
				'Display 5 - 4 lines with character limit of 130. Leo mauris fermentum pharetra blandit tellus euismod…',
			description:
				'Body small - 4 lines with character limit of 170. Leo mauris fermentum pharetra blandit tellus euismod pharetra. Duis egestas volutpat dolor…',
		},
		{
			link: 'https://hashicorp.com',
			meta: ['USE CASES'],
			heading:
				'Display 5 - 4 lines with character limit of 130. Leo mauris fermentum pharetra blandit tellus euismod…',
			description:
				'Body small - 4 lines with character limit of 170. Leo mauris fermentum pharetra blandit tellus euismod pharetra. Duis egestas volutpat dolor…',
		},
		{
			link: 'https://hashicorp.com',
			meta: ['USE CASES'],
			heading:
				'Display 5 - 4 lines with character limit of 130. Leo mauris fermentum pharetra blandit tellus euismod…',
			description:
				'Body small - 4 lines with character limit of 170. Leo mauris fermentum pharetra blandit tellus euismod pharetra. Duis egestas volutpat dolor…',
		},
	],
	cta: {
		text: 'Sign up now',
		href: '/components/relatedcontent',
	},
}

describe('<RelatedContent />', () => {
	it('should render the headline prop', () => {
		render(<RelatedContent {...defaultProps} />)
		const headlineText = screen.getByText(defaultProps.headline)
		expect(headlineText.tagName).toBe('H2')
		expect(headlineText).toHaveClass(/headline/)
	})

	it('should render the description prop', () => {
		render(<RelatedContent {...defaultProps} />)
		const descText = screen.getByText(defaultProps.description)
		expect(descText.tagName).toBe('P')
		expect(descText).toHaveClass(/description/)
	})

	it('should render cards', () => {
		render(<RelatedContent {...defaultProps} />)
		const cardsContainer = screen.getByTestId('wpl-cards-container')
		expect(cardsContainer.children.length).toBeGreaterThan(0)
	})

	it('should render the optional CTA', () => {
		render(<RelatedContent {...defaultProps} />)
		const ctaContainer = screen.getByTestId('wpl-cta-container')
		expect(ctaContainer).toHaveClass(/cta/)
	})
})
