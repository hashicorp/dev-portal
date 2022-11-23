import Footer from 'components/_proxied-dot-io/waypoint/footer'

function FooterWithProps({
	openConsentManager,
}: {
	openConsentManager: () => void
}): React.ReactElement {
	return (
		<Footer
			openConsentManager={openConsentManager}
			heading="Using Waypoint"
			description="The best way to understand what Waypoint can enable for your projects is to give it a try."
			cards={[
				{
					link: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-kubernetes',
					img: '/waypoint-public/img/get-started-kubernetes.png',
					eyebrow: 'Tutorial',
					title: 'Get Started - Kubernetes',
					description:
						'Build, deploy, and release applications to a Kubernetes cluster.',
				},
				{
					link: 'https://developer.hashicorp.com/waypoint/tutorials/get-started-docker/get-started-intro',
					img: '/waypoint-public/img/intro-to-waypoint.png',
					eyebrow: 'Tutorial',
					title: 'Introduction to Waypoint',
					description:
						'Waypoint enables you to publish any application to any platform with a single file and a single command.',
				},
			]}
			ctaLinks={[
				{
					text: 'Waypoint tutorials',
					url: 'https://developer.hashicorp.com/waypoint/tutorials',
				},
				{
					text: 'Waypoint documentation',
					url: '/docs',
				},
			]}
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
					url: 'https://developer.hashicorp.com/waypoint/tutorials',
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
