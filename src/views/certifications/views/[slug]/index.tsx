/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseNewLayout from 'layouts/base-new'
// Share certifications
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	SignupFormArea,
} from 'views/certifications/components'
// Local
import { ExamDetailsCard, ProgramHero, HeadingPermalink } from './components'
import { CertificationProgramViewProps } from './types'
import s from './program-view.module.css'

function CertificationProgramView({
	pageContent,
	slug,
}: CertificationProgramViewProps) {
	const { hero, exams } = pageContent

	return (
		<>
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
							const accordionHeading = `${fullTitle} Details`

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
				</CertificationsMaxWidth>
			</div>
		</>
	)
}

CertificationProgramView.layout = BaseNewLayout
export default CertificationProgramView
