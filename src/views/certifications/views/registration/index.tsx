/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import LandingHero from '@components/landing-hero'
import Heading from 'components/heading'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import DevDotContent from '@components/dev-dot-content'
import { IconAward16 } from '@hashicorp/flight-icons/svg-react/award-16'
import { IconSupport16 } from '@hashicorp/flight-icons/svg-react/support-16'
// Certifications components
import {
	CertificationsMaxWidth,
	GradientCard,
} from 'views/certifications/components'

// TODO: This component will be created in this asana task: https://app.asana.com/1/90955849329269/project/1210146125607830/task/1210872813172505?focus=true
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
				{/* Note: similar to PreFooter component but has slightly different styling */}
				<section>
					<div>
						<div>
							<Heading level={2} size={500} weight="bold">
								{jsonContent.footer_title}
							</Heading>
							<Text>{jsonContent.footer_description}</Text>
						</div>
						<div>
							<div>
								<StandaloneLink
                                    color="secondary"
									href="https://support.hashicorp.com/hc/en-us"
									icon={<IconSupport16 />}
									iconPosition="leading"
									text={jsonContent.footer_cta}
									opensInNewTab
								/>
							</div>
						</div>
					</div>
				</section>
			</CertificationsMaxWidth>
		</BaseLayout>
	)
}

export default CertificationsRegistrationView
