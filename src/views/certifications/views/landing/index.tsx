// Global
import BaseNewLayout from 'layouts/base-new'
// Local view
import { CertificationProgramSection, LandingHero } from './components'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import s from './landing.module.css'

function CertificationsLandingView({
	pageContent,
	programSummaries,
	faqItems,
}: CertificationLandingProps) {
	const { hero } = pageContent
	return (
		<>
			{/* Hero */}
			<LandingHero heading={hero.heading} description={hero.description} />
			{/* Program Summaries */}
			<div className={s.programsSection}>
				{programSummaries.map((programSummary: CertificationProgramSummary) => {
					const { slug, heading, description, exams } = programSummary
					return (
						<CertificationProgramSection
							key={slug}
							slug={slug}
							heading={heading}
							description={description}
							exams={exams}
						/>
					)
				})}
			</div>
			{/* Content Debug */}
			<pre style={{ border: '1px solid magenta', margin: '0' }}>
				<code>
					{JSON.stringify(
						{
							faqItems,
						},
						null,
						2
					)}
				</code>
			</pre>
		</>
	)
}

CertificationsLandingView.layout = BaseNewLayout
export default CertificationsLandingView
