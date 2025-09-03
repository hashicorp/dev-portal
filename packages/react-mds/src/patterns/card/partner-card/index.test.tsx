import { render, screen } from '@testing-library/react'
import { PartnerCard } from '../partner-card'

const defaultProps = {
	logo: {
		width: 360,
		src: 'https://www.datocms-assets.com/2885/1506535057-black.svg',
		height: 97,
		alt: 'GitHub Logo',
	},
	link: '#',
	heading: 'Github',
	description:
		'GitHub, Inc. is a provider of Internet hosting for software development and version control using Git.',
	meta: ['Tech Partner'],
}

describe('<PartnerCard />', () => {
	it('should not render badges when none are provided', () => {
		render(<PartnerCard {...defaultProps} />)

		const badgeElement = screen.queryByTestId('wpl-card-badges')

		expect(badgeElement).toBeNull()
	})

	it('should render badges when badges are provided', () => {
		const competencyBadges = ['Infrastructure', 'Security']

		render(
			<PartnerCard {...defaultProps} competencyBadges={competencyBadges} />
		)

		const badgeElement = screen.getByTestId('wpl-card-badges')

		competencyBadges.forEach((item) => {
			expect(badgeElement).toContainElement(screen.getByText(item))
		})
	})

	it('should render badges when product badges are provided', () => {
		const productBadges = ['vault' as const, 'terraform' as const]

		render(<PartnerCard {...defaultProps} productBadges={productBadges} />)

		const badgeElement = screen.getByTestId('wpl-card-badges')

		productBadges.forEach((item) => {
			expect(badgeElement).toContainElement(screen.getByText(item))
		})
	})
})
