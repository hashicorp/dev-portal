import { ReactElement } from 'react'
import { productSlugs } from 'lib/products'
import { IconSupport24 } from '@hashicorp/flight-icons/svg-react/support-24'
import { IconHelp24 } from '@hashicorp/flight-icons/svg-react/help-24'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import BaseNewLayout from 'layouts/base-new'
import Hero from './components/hero'
import PreFooter from './components/pre-footer'
import ProductNav from './components/product-nav'
import TutorialCard from './components/tutorial-card'

const productNavSlugs = productSlugs.filter((slug) => slug !== 'sentinel')

function Homepage(): ReactElement {
  return (
    <>
      <Hero
        badgeText="Beta"
        heading="HashiCorp Developer Portal"
        description={
          <>
            <p>
              The home of HashiCorp documentation and learning content for
              developers and technology professionals.
            </p>
            <p>More products and featrues coming soon....</p>
          </>
        }
        actions={[
          {
            heading: 'This is a pretty long  CTA headline for this area',
            description:
              'This is supporting docs or left cta copy for hero section. This is also a lot of supporting copy for such a small area.',
            link: '/',
            linkText: 'Get started',
          },
          {
            heading: 'This headline could literally be anything',
            description:
              'This is supporting docs or left cta copy for hero section. This is also a lot of supporting copy for such a small area.',
            link: '/',
            linkText: 'Get started',
          },
        ]}
      />

      <ProductNav
        notice="All HashiCorp products are being added and will be available here in the
        Developer Portal"
        products={productNavSlugs}
      />

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        <TutorialCard
          link="/"
          duration="10min"
          heading="Title Max 70 Characters"
          description="Body maximum 130 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor vitae pharetra accumsan risu, eu v..."
          badges={['hcp', 'vault', 'boundary', 'nomad', 'video']}
        />
        <TutorialCard
          link="/"
          duration="10min"
          heading="Title Max 70 Characters Try and Keep it to a Max of Three Lines Loremi"
          description="Body maximum 130 characters. Auctor vitae pharetra accumsan risu, eu v..."
          badges={['vault', 'terraform', 'consul', 'video']}
        />
        <TutorialCard
          link="/"
          duration="10min"
          heading="Title Max 70 Characters"
          description="Body maximum 130 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor vitae pharetra accumsan risu, eu v..."
          badges={['vault', 'boundary', 'interactive', 'video']}
        />
      </section>

      <PreFooter
        heading="Looking for help?"
        description="Aenean interdum pulvinar nunc et maximus. Etiam imperdiet mattis sapien id commodow Aenean interdum pulvinar nunc nean interdum pulvinar."
        ctas={[
          {
            icon: (
              <IconSupport24 color="var(--token-color-highlight-foreground-primary)" />
            ),
            heading: 'Support',
            description: 'Open a support ticket',
            link: '/',
          },
          {
            icon: <IconHelp24 color="var(--token-color-packer-brand)" />,
            heading: 'Forum',
            description: 'Find your answer on the forum',
            link: '/',
          },
          {
            icon: <IconUser24 color="var(--token-color-nomad-brand)" />,
            heading: 'Community',
            description: 'Join our community',
            link: '/',
          },
        ]}
      />
    </>
  )
}

Homepage.layout = BaseNewLayout
export default Homepage
