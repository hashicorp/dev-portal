/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	SignupFormArea,
} from 'views/certifications/components'
// Local view
import { CertificationProgramSummaryCard, LandingHero } from './components'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import s from './landing.module.css'

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
				{/* Program Summaries */}
				<div className={s.programsSection}>
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
						}
					)}
				</div>
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
