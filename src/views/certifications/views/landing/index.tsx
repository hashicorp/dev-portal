/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import {
	AccordionWithMdxContent,
	Announcement,
	CertificationsMaxWidth,
	SignupFormArea,
	CertificationCardContainer,
} from 'views/certifications/components'
// Local view
import { CertificationProgramSummaryCard } from './components'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import s from './landing.module.css'
import LandingHero from 'components/landing-hero'

function CertificationsLandingView({
	pageContent,
	programSummaries,
	faqItems,
}: CertificationLandingProps) {
	const { hero } = pageContent

	const certData = [
		{
			product: 'terraform',
			title: 'Terraform Associate',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 1,
			ctaLink: 'certifications',
			certDetails: [
				'Product version tested: Terraform 1.12',
				'Terraform basic concepts and skills',
				'Terraform Associate value proposition',
			],
		},
		{
			product: 'terraform',
			title: 'Terraform Authoring and Operations Professional',
			desc: 'Brief description to gives the user enough context to take the next step with confidence',
			starCount: 3,
			ctaLink: 'certifications',
			certDetails: [
				'Product version tested: Terraform 1.12',
				'Terraform advanced concepts and skills',
				'Terraform Professional value proposition',
			],
		},
	]

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				{/* Hero */}
				<LandingHero heading={hero.heading} description={hero.description} />
				<CertificationsMaxWidth>
					<Announcement
						heading="TechXchange is Coming"
						text="Learn from certified instructors on how to boost your enterprise adoption of HashiCorp"
						cta="Read more"
						ctaLink="https://developer.hashicorp.com"
					/>
					<CertificationCardContainer
						product={'Terraform'}
						containerDesc={
							'We offer Terraform certifications at two levels. Earn the Terraform Associate certification to validate your foundational Terraform knowledge and skills. Demonstrate your advanced Terraform production experience with the Terraform Authoring and Operations Professional certification.'
						}
						certData={certData}
					/>
				</CertificationsMaxWidth>
				{/* Program Summaries */}
				{/* <div className={s.programsSection}>
					{programSummaries.map(
						(programSummary: CertificationProgramSummary) => {
							const { slug, heading, description, exams } = programSummary
							return (
								<CertificationsMaxWidth key={slug}>
									<CertificationProgramSummaryCard
										slug={slug}
										heading={heading}
										description={description}
										exams={exams}
									/>
								</CertificationsMaxWidth>
							)
						},
					)}
				</div> */}
				<div className={s.faqSignupSection}>
					<CertificationsMaxWidth>
						<h2 className={s.faqHeading}>{pageContent.faqHeading}</h2>
						<AccordionWithMdxContent items={faqItems} />
						<div className={s.signupForm}>
							<SignupFormArea />
						</div>
					</CertificationsMaxWidth>
				</div>
			</div>
		</BaseLayout>
	)
}

export default CertificationsLandingView
