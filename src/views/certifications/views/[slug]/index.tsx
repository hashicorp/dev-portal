// Global
import BaseNewLayout from 'layouts/base-new'
// Share certifications
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
} from 'views/certifications/components'
// Local
import { OverviewCard, ProgramHero } from './components'
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
							return (
								<div key={slug}>
									<OverviewCard
										title={exam.title}
										description={exam.description}
										links={exam.links}
										productSlug={exam.productSlug}
										versionTested={exam.versionTested}
										slug={slug}
									/>
									<h2 className={s.examAccordionHeading}>Overview</h2>
									<AccordionWithMdxContent
										items={exam.faqItems.map((faqItem) => {
											return {
												title: faqItem.title,
												mdxSource: faqItem.mdxSource,
											}
										})}
									/>
								</div>
							)
						})}
					</div>
				</CertificationsMaxWidth>
			</div>
		</>
	)
}

CertificationProgramView.layout = BaseNewLayout
export default CertificationProgramView
