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
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { PreFooter } from 'views/homepage/components'
// Certifications components
import {
	CertificationsMaxWidth,
	GradientCard,
} from 'views/certifications/components'
// Types
import type { CertificationRegistrationProps } from './types'
import type { FaqItem } from 'views/certifications/types'

// TODO: This component will be updated in this asana task:
// https://app.asana.com/1/90955849329269/project/1210146125607830/task/1210872813172505?focus=true
function MdxTooltip({ title, description }) {
	return (
		<div>
			<IconAward16 />
			<p>{title}</p>
			<p>{description}</p>
		</div>
	)
}

const MDX_COMPONENTS = {
	Tooltip: MdxTooltip,
}

function CertificationsRegistrationView({ jsonContent, mdxItems }: CertificationRegistrationProps) {
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			{/* Hero */}
			<LandingHero heading={jsonContent.page_title} noImage={true} />
			<CertificationsMaxWidth>
				{/* Info cards */}
				{mdxItems.map((item: FaqItem) => (
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
