import Footer from 'components/_proxied-dot-io/waypoint/footer'
import { CardProps } from '../card'

function FooterWithProps({
	openConsentManager,
	heading,
	description,
	cards,
	ctaLinks,
}: {
	openConsentManager: () => void
	heading: string
	description: string
	cards: [CardProps, CardProps]
	ctaLinks: Array<{
		text: string
		url: string
	}>
}): React.ReactElement {
	return (
		<Footer
			openConsentManager={openConsentManager}
			heading={heading}
			description={description}
			cards={cards}
			ctaLinks={ctaLinks}
			navLinks={[
				{
					text: 'Documentation',
					url: '/docs',
				},
				{
					text: 'CLI Reference',
					url: '/commands',
				},
				{
					text: 'Tutorials',
					url: 'https://learn.hashicorp.com/waypoint',
				},
				{
					text: 'Integrations',
					url: '/plugins',
				},
			]}
		/>
	)
}

export default FooterWithProps
