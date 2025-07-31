/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import LandingHero from '@components/landing-hero'
import DevDotContent from '@components/dev-dot-content'
import { IconAward24 } from '@hashicorp/flight-icons/svg-react/award-24'
import InlineAlert from '@components/inline-alert'
import { PreFooter } from 'views/homepage/components'
// Certifications components
import {
	CertificationsMaxWidth,
	GradientCard,
} from 'views/certifications/components'

function MdxTooltip({ title, description }) {
	return (
		<InlineAlert title={title} description={description} icon={<IconAward24 />} />
	)
}

const MDX_COMPONENTS = {
	Tooltip: MdxTooltip,
}

function CertificationsRegistrationView({ jsonContent, mdxItems }) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			{/* Hero */}
			<LandingHero heading={jsonContent.page_title} noImage={true} />
			<CertificationsMaxWidth>
				{/* Info cards */}
				{mdxItems.map((item) => (
					<GradientCard key={item.title}>
						<div>{item.title}</div>
						<DevDotContent
							mdxRemoteProps={{ ...item.mdxSource, components: MDX_COMPONENTS }}
						/>
					</GradientCard>
				))}
				{/* Main CTA */}
				<a href={jsonContent.main_cta_url}>
					<div>{jsonContent.main_cta_title}</div>
					<div>{jsonContent.main_cta_description}</div>
					<div>{jsonContent.main_cta_link_text}</div>
				</a>
				{/* Footer */}
				<PreFooter
					heading={jsonContent.footer_title}
					description={jsonContent.footer_description}
					actions={[
						{
							icon: 'support',
							heading: 'Support',
							description: jsonContent.footer_cta,
							link: 'https://support.hashicorp.com/hc/en-us',
						},
					]}
				/>
			</CertificationsMaxWidth>
		</BaseLayout>
	)
}

export default CertificationsRegistrationView
