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
          link:
            'https://learn.hashicorp.com/collections/waypoint/get-started-kubernetes',
          img: '/waypoint/img/get-started-kubernetes.png',
          eyebrow: 'Tutorial',
          title: 'Get Started - Kubernetes',
          description:
            'Build, deploy, and release applications to a Kubernetes cluster.',
        },
        {
          link:
            'https://learn.hashicorp.com/tutorials/waypoint/get-started-intro',
          img: '/waypoint/img/intro-to-waypoint.png',
          eyebrow: 'Tutorial',
          title: 'Introduction to Waypoint',
          description:
            'Waypoint enables you to publish any application to any platform with a single file and a single command.',
        },
      ]}
      ctaLinks={[
        {
          text: 'Waypoint tutorials',
          url: 'https://learn.hashicorp.com/waypoint',
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
