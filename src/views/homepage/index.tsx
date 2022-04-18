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
        heading="HashiCorp Developer"
        description={
          <>
            <Text>
              Learn at your own pace in one place with reference docs, step by
              step tutorials, videos, and real hands-on lab workstations to
              automate your infrastructure, networking, and security workflows.
            </Text>
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
            src="/img/homepage/vault-certified-expert-badge.png"
            width={397}
            height={228}
            alt="Vault certified expert badge"
          />
        }
        heading="Become HashiCorp Vault Certified"
        description={
          <>
            <Text size={300}>
              As a Cloud Engineer specializing in security, development, or
              operations, you can take the Vault Associate exam to validate your
              knowledge of the basic concepts, skills, and use cases associated
              with open source HashiCorp Vault. Or take the Vault Operations
              Professional exam to demonstrate your proficiency with deploying,
              configuring, managing, and monitoring HashiCorp Vault in
              production.
            </Text>
            <Text size={300}>
              Upon passing either exam, you can easily communicate your
              proficiency and employers can quickly verify your results.
            </Text>
          </>
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
        actions={[
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
