import { render, screen } from '@testing-library/react'
import { PersonCard } from './index'

const defaultProps = {
	link: 'https://hashicorp.com',
	name: 'Example name',
	bio: 'Example bio',
	location: 'Example location',
	meta: ['August 15, 2022', 'Category'],
	thumbnail: {
		src: 'https://www.datocms-assets.com/19447/1648680074-screenshot-2022-03-31-at-00-40-47.png',
		alt: 'HashiConf Europe 2022 Recap',
	},
}

describe('<PersonCard />', () => {
	// Prop tests
	it('should render the provided name prop', () => {
		render(<PersonCard {...defaultProps} />)

		const name = screen.getByText(defaultProps.name)
		expect(name.tagName).toBe('H2')
	})

	it('should render the provided bio prop', () => {
		render(<PersonCard {...defaultProps} />)

		const bio = screen.getByText(defaultProps.bio)
		expect(bio.tagName).toBe('P')
	})

	it('should render the provided location prop', () => {
		render(<PersonCard {...defaultProps} />)

		const location = screen.getByText(defaultProps.location)
		expect(location.tagName).toBe('P')
	})

	it('should render the correct thumbnail icon based on the provided link prop', () => {
		const links = {
			github: 'https://github.com',
			twitter: 'https://twitter.com',
			linkedin: 'https://linkedin.com',
			link: 'https://example.com',
			mail: 'mailto:name@example.com',
		} as const

		render(
			<>
				{(Object.keys(links) as (keyof typeof links)[]).map((platform) => (
					<PersonCard key={platform} {...defaultProps} link={links[platform]} />
				))}
			</>
		)

		Object.keys(links).forEach((platform) => {
			screen.getByTestId(`wpl-personcard-${platform}-icon`)
		})
	})

	it('should not render a thumbnail icon when link is on hashicorp.com', () => {
		render(<PersonCard {...defaultProps} link="https://hashicorp.com" />)

		expect(screen.queryByTestId('wpl-personcard-link-icon')).toBeNull()
	})
})
