// Global
import BaseNewLayout from 'layouts/base-new'
import classNames from 'classnames'
import slugify from 'slugify'
// Share certifications
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	SignupFormArea,
} from 'views/certifications/components'
// Local
import { ExamDetailsCard, ProgramHero } from './components'
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
							const accordionId = `${slugify(accordionHeading, {
								lower: true,
							})}`
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

									<h2
										className={classNames(
											s.examAccordionHeading,
											'g-offset-scroll-margin-top'
										)}
										id={accordionId}
									>
										<a href={`#${accordionId}`}>{accordionHeading}</a>
									</h2>
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
