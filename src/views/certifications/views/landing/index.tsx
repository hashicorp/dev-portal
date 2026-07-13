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
	CertificationCardDisplay,
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
	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				{/* Hero */}
				<LandingHero heading={hero.heading} description={hero.description} />
				<CertificationsMaxWidth>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<CertificationCardDisplay
							product={"terraform"}
							title={"Terraform Associate"} 
							desc={"Brief description to gives the user enough context to take the next step with confidence"} 
							starCount={3}
							ctaLink={"certifications"}
							certDetails={[
								"Product version tested: Terraform 1.12", 
								"Terraform basic concepts and skills",
								"Terraform Associate value proposition"]} 
							isReduced={true} 
						/>
						<CertificationCardDisplay
							product={"terraform"}
							title={"Terraform Authoring and Operations Professional"} 
							desc={"Brief description to gives the user enough context to take the next step with confidence"} 
							starCount={3}
							ctaLink={"certifications"}
							certDetails={[
								"Product version tested: Terraform 1.12", 
								"Terraform advanced concepts and skills",
								"Terraform Professional value proposition"]} 
							isReduced={true} 
						/>
					</div>
					<Announcement
						heading="TechXchange is Coming"
						text="Learn from certified instructors on how to boost your enterprise adoption of HashiCorp"
						cta="Read more"
						ctaLink="https://developer.hashicorp.com"
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
