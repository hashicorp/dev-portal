import classNames from 'classnames'
// Global
import BaseNewLayout from 'layouts/base-new'
// Shared view components
import {
	AccordionWithMdxContent,
	CertificationsMaxWidth,
	CertificationsHero,
	GradientCardTheme,
	SignupFormArea,
} from 'views/certifications/components'
// Local view components
import { OverviewCard } from './components/certification-program-details/components'
import { CertificationPageProps } from './types'
// Styles
import s from './program-view.module.css'

function CertificationPage({ pageContent, slug }: CertificationPageProps) {
	return (
		<>
			<CertificationsHero
				heading={pageContent.hero.heading}
				description={pageContent.hero.description}
				foreground={slug === 'security-automation' ? 'dark' : 'light'}
				backgroundSlot={
					<div className={classNames(s.heroBackground, s[`theme-${slug}`])} />
				}
			/>
			<div className={s.mainSection}>
				<CertificationsMaxWidth key={slug}>
					<div className={s.examsSection}>
						{pageContent.exams.map((exam) => {
							return (
								<div key={slug}>
									<OverviewCard
										title={exam.title}
										description={exam.description}
										links={exam.links}
										productSlug={exam.productSlug}
										versionTested={exam.versionTested}
										slug={slug as GradientCardTheme}
									/>
									<h2 className={s.examAccordionHeading}>Overview</h2>
									<AccordionWithMdxContent
										items={exam.faqItems.map((faqItem) => {
											return {
												title: faqItem.title,
												mdxSource: faqItem.mdxSource,
											}
										})}
										activatorHeadingLevel="h3"
									/>
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

CertificationPage.layout = BaseNewLayout
export default CertificationPage
