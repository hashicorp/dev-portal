/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import image from '../../../../../public/img/homepage/waypoint-slot-accent.svg'
// Share certifications
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	SignupFormArea,
} from 'views/certifications/components'
// Local
import {
	ExamDetailsCard,
	ProgramHero,
	HeadingPermalink,
	LinkWithImage,
} from './components'
import { CertificationProgramViewProps } from './types'
import s from './program-view.module.css'

function CertificationProgramView({
	pageContent,
	slug,
}: CertificationProgramViewProps) {
	const { hero, exams } = pageContent

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<ProgramHero
				heading={hero.heading}
				description={hero.description}
				slug={slug}
			/>
			<div className={s.mainSection}>
				<CertificationsMaxWidth key={slug}>
					<div className={s.examsSection}>
						{exams.map((exam) => {
							const { title, examCode } = exam
							const fullTitle = title + (examCode ? ` (${examCode})` : '')
							const accordionHeading = `${fullTitle} details`

							return (
								<div key={fullTitle}>
									<ExamDetailsCard
										title={fullTitle}
										description={exam.description}
										links={exam.links}
										examTier={exam.examTier}
										productSlug={exam.productSlug}
										versionTested={exam.versionTested}
										slug={slug}
									/>
									<HeadingPermalink heading={accordionHeading} />
									<AccordionWithMdxContent items={exam.faqItems} />
								</div>
							)
						})}
					</div>
					<div className={s.signupForm}>
						<SignupFormArea />
					</div>
					<div className={s.knowledgeBaseLink}>
						<LinkWithImage
							title="knowledge base for FAQs"
							description="As a cloud engineer specializing in DevOps, IT, security, or development, you can use the HashiCorp certification program to earn formal"
							cta="Go to knowledge base"
							ctaLink="https://developer.hashicorp.com"
							image={image}
						/>
					</div>
				</CertificationsMaxWidth>
			</div>
		</BaseLayout>
	)
}

export default CertificationProgramView
