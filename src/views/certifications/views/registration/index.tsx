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
import Heading from 'components/heading'
import Text from 'components/text'
import CardLink from 'components/card-link'
import { IconSupport16 } from '@hashicorp/flight-icons/svg-react/support-16'
import ButtonLink from '@components/button-link'
// Certifications components
import {
	CertificationsMaxWidth,
	GradientCard,
	CtaGroup,
	StandaloneLinkContents,
} from 'views/certifications/components'
// Styles
import s from './registration.module.css'
// Types
import type { CertificationRegistrationProps } from './types'

function MdxTooltip({ title, description }) {
	return (
		<InlineAlert
			title={title}
			description={description}
			icon={<IconAward24 />}
		/>
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
				<div className={s.root}>
					{/* Info cards */}
					{mdxItems.map((item, index: number) => {
						// Alternate themes for the gradient cards
						const theme =
							index % 2 === 0
								? 'infrastructure-automation'
								: 'security-automation'
						return (
							<GradientCard key={item.title} theme={theme}>
								<div className={s.cardContent}>
									<h3 className={s.cardTitle}>{item.title}</h3>
									<DevDotContent
										className={s.mdxContent}
										mdxRemoteProps={{
											...item.mdxSource,
											components: MDX_COMPONENTS,
										}}
									/>
								</div>
							</GradientCard>
						)
					})}
					{/* Main CTA */}
					<CardLink
						className={s.mainCta}
						href={jsonContent.main_cta_url}
						ariaLabel={jsonContent.main_cta_title}
					>
						<div className={s.mainCtaContent}>
							<div>
								<Text className={s.mainCtaTitle}>
									{jsonContent.main_cta_title}
								</Text>
								<Text className={s.mainCtaDescription}>
									{jsonContent.main_cta_description}
								</Text>
							</div>
							<CtaGroup className={s.mainCtaLinkText}>
								<StandaloneLinkContents text={jsonContent.main_cta_link_text} />
							</CtaGroup>
						</div>
					</CardLink>
				</div>
			</CertificationsMaxWidth>
			{/* Footer */}
			<section className={s.footer}>
				<div className={s.footerContainer}>
					<div className={s.footerContent}>
						<Heading
							level={2}
							size={500}
							weight="bold"
							id={jsonContent.footer_title}
						>
							{jsonContent.footer_title}
						</Heading>
						<Text>{jsonContent.footer_description}</Text>
					</div>
					<ButtonLink
						href="https://developer.hashicorp.com/"
						text={jsonContent.footer_cta}
						color="secondary"
						icon={<IconSupport16 />}
						className={s.footerButton}
					/>
				</div>
			</section>
		</BaseLayout>
	)
}

export default CertificationsRegistrationView
