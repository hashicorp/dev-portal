import { ReactElement } from 'react'
import Image from 'next/image'
import { productSlugs } from 'lib/products'
import { IconSupport24 } from '@hashicorp/flight-icons/svg-react/support-24'
import { IconHelp24 } from '@hashicorp/flight-icons/svg-react/help-24'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import BaseNewLayout from 'layouts/base-new'
import InlineLink from 'components/inline-link'
import Text from 'components/text'
import Hero from './components/hero'
import PreFooter from './components/pre-footer'
import ProductNav from './components/product-nav'
import LearnSection from './components/learn-section'
import MerchandisingSlots from './components/merchandising-slots'
import {
  HcpVaultSlot,
  WaypointSlot,
  HashiConfGlobalSlot,
  VaultSlot,
} from './components/merchandising-slots/slots'
import s from './homepage.module.css'

const productNavSlugs = productSlugs.filter((slug) => slug !== 'sentinel')

function Homepage(): ReactElement {
  return (
    <div className={s.homepage}>
      <Hero
        badgeText="Beta"
        heading="HashiCorp Developer Portal"
        description={
          <>
            <Text>
              The home of HashiCorp documentation and learning content for
              developers and technology professionals.
            </Text>
            <Text>More products and featrues coming soon....</Text>
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

      <MerchandisingSlots>
        <HcpVaultSlot />
        <WaypointSlot />
        <HashiConfGlobalSlot />
        <VaultSlot />
      </MerchandisingSlots>

      <LearnSection
        media={
          <Image
            src="/img/homepage/vault-certified-expert-badge.svg"
            width={397}
            height={228}
            alt="Vault certified expert badge"
          />
        }
        heading="Prepare for Vault Certifications"
        description={
          <Text size={300}>
            Learn at your own pace, with self-guided tutorials, videos, and
            Advance your career through our industry-recognized{' '}
            <InlineLink
              href="/example"
              text="HashiCorp Cloud Engineer Certifications"
            />
            . Use our study guides and sample questions to prepare.
          </Text>
        }
        tutorials={[
          {
            link: '/',
            duration: '10min',
            heading: 'Title Max 70 Characters',
            description: 'Body maximum 130 characters.',
            badges: ['hcp', 'vault', 'boundary', 'nomad', 'video'],
          },
          {
            link: '/',
            duration: '10min',
            heading: 'Title Max 70 Characters',
            description:
              'Body maximum 130 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor vitae pharetra accumsan risu, eu v...',
            badges: ['hcp', 'vault', 'boundary', 'nomad', 'video'],
          },
          {
            link: '/',
            duration: '10min',
            heading: 'Title Max 70 Characters',
            description:
              'Body maximum 130 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor vitae pharetra accumsan risu, eu v...',
            badges: ['hcp', 'vault', 'boundary', 'nomad', 'video'],
          },
        ]}
      />

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
    </div>
  )
}

Homepage.layout = BaseNewLayout
export default Homepage
