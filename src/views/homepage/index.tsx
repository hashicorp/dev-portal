// Third-party imports
import { ReactElement } from 'react'

// HashiCorp imports
import { IconSupport24 } from '@hashicorp/flight-icons/svg-react/support-24'
import { IconHelp24 } from '@hashicorp/flight-icons/svg-react/help-24'
import { IconUser24 } from '@hashicorp/flight-icons/svg-react/user-24'
import InlineSvg from '@hashicorp/react-inline-svg'

// Global imports
import { productSlugs } from 'lib/products'
import { ProductOption } from 'lib/learn-client/types'
import { generateTopLevelSubNavItems } from 'lib/generate-top-level-sub-nav-items'
import { useDeviceSize } from 'contexts'
import BaseNewLayout from 'layouts/base-new'
import Text from 'components/text'
import MobileMenuContainer from 'components/mobile-menu-container'
import { SidebarNavMenuItem } from 'components/sidebar/components'

// Local imports
import PreFooter from './components/pre-footer'
import ProductNav from './components/product-nav'
import LearnSection from './components/learn-section'
import MerchandisingSlots from './components/merchandising-slots'
import { HeroWithVideo, HeroWithActions } from './components/hero'
import {
  HashiConfGlobalSlot,
  VaultSlot,
} from './components/merchandising-slots/slots'
import badge from './img/vault-certified-expert-badge.svg?include'
import s from './homepage.module.css'

const productNavSlugs = productSlugs.filter((slug) => slug !== 'sentinel')

const HomePageMobileMenu = () => {
  return (
    <MobileMenuContainer className={s.mobileMenuContainer}>
      <ul className={s.mobileMenuNavList}>
        <SidebarNavMenuItem item={{ heading: 'Main Menu' }} />
        {generateTopLevelSubNavItems().map((item: $TSFixMe, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <SidebarNavMenuItem item={item} key={index} />
        ))}
      </ul>
    </MobileMenuContainer>
  )
}

const HomePageContent = () => {
  return (
    <>
      {/* <HeroWithActions
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
      /> */}
      <HeroWithVideo
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
        videoUrl="https://hashicorp.wistia.com/medias/031h9iogzx"
      />

      <ProductNav
        notice="All HashiCorp products are being added and will be available here."
        products={productNavSlugs}
      />

      <MerchandisingSlots>
        <VaultSlot />
        <HashiConfGlobalSlot />
      </MerchandisingSlots>

      <LearnSection
        media={<InlineSvg src={badge} />}
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
            url: '/vault/tutorials/associate-cert',
            duration: '30min',
            heading: 'Study for the Vault Associate Exam',
            description:
              'Demonstrate your knowledge of the basic concepts, skills, and use cases associated with open source HashiCorp Vault. This is a multiple choice exam.',
            productsUsed: ['vault'] as ProductOption[],
            hasVideo: true,
            hasInteractiveLab: false,
          },
          {
            url: '/vault/tutorials/ops-pro-cert',
            duration: '45min',
            heading: 'Study for the Vault Operations Professional Exam',
            description:
              'Demonstrate your ability to deploy, configure, manage, and monitor HashiCorp Vault in production. This is a hands-on exam.',
            productsUsed: ['vault'] as ProductOption[],
            hasVideo: true,
            hasInteractiveLab: false,
          },
        ]}
      />

      <PreFooter
        heading="Looking for help?"
        description="We offer paid support, a free forum, and other community resources."
        actions={[
          {
            icon: (
              <IconSupport24 color="var(--token-color-foreground-highlight)" />
            ),
            heading: 'Support',
            description: 'Open a support ticket',
            link: 'https://support.hashicorp.com/hc/en-us',
          },
          {
            icon: <IconHelp24 color="var(--token-color-packer-brand)" />,
            heading: 'Forum',
            description: 'Find your answer on the forum',
            link: 'https://discuss.hashicorp.com/',
          },
          {
            icon: <IconUser24 color="var(--token-color-nomad-brand)" />,
            heading: 'Community',
            description: 'Join our community',
            link: 'https://www.hashicorp.com/community',
          },
        ]}
      />
    </>
  )
}

function HomePageView(): ReactElement {
  const { isDesktop } = useDeviceSize()

  return (
    <div className={s.homepage}>
      {!isDesktop && <HomePageMobileMenu />}
      <HomePageContent />
    </div>
  )
}

HomePageView.layout = BaseNewLayout
export default HomePageView
