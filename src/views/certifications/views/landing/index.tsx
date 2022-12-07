import BaseNewLayout from 'layouts/base-new'
import { CertificationLandingProps, CertificationProgramSummary } from './types'
import {
	CertificationsContentArea,
	CertificationsHero,
	CertificationsNav,
} from '../../components'
import {
	CertificationProgramSection,
	OverviewAndFaq,
	SignupFormArea,
} from './components'
import s from './landing.module.css'

function CertificationsLandingView({
	navProps,
	pageContent,
	programSummaries,
}: CertificationLandingProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsHero
				heading="HashiCorp Cloud Engineer Certifications"
				description="Each certification program tests both conceptual knowledge and real-world experience using HashiCorp multi-cloud tools. Upon passing the exam, you can easily communicate your proficiency and employers can quickly verify your results."
			/>
			<div className={s.programsAndFaq}>
				<div className={s.programsSection}>
					{programSummaries.map(
						(programSummary: CertificationProgramSummary) => {
							return (
								<CertificationProgramSection
									key={programSummary.slug}
									heading={programSummary.title}
									description={programSummary.description}
									overviewCta={{
										text: 'Overview',
										url: `/certifications/${programSummary.slug}`,
									}}
									certifications={programSummary.certifications}
								/>
							)
						}
					)}
				</div>
				<OverviewAndFaq
					heading="Program overview & FAQ"
					faqs={[
						{
							title: 'Exam experience',
							content:
								'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
						},
						{
							title: 'New disclosure',
							content:
								'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
						},
						{
							title: 'New disclosure (elevation high on hover)',
							content:
								'Certification exams are taken online with a live proctor. This means that all locations and time zones are accommodated. Online proctoring provides the same benefits of a physical test center while being more accessible to exam-takers. The live proctor verifies the exam-taker’s identity, walks them through rules and procedures, and watches them take the exam. Be sure to follow the instructions on your exam appointment confirmation email about how to prepare your computer and physical environment to take the exam.',
						},
					]}
				/>
			</div>
			<SignupFormArea />
			<CertificationsContentArea>
				<h2>{`[dev]`} Content Debug</h2>
				<pre
					className="hds-typography-code-100"
					style={{
						whiteSpace: 'pre-wrap',
						background: '#EEEEEE',
						padding: '2rem',
					}}
				>
					<code>{JSON.stringify({ pageContent }, null, 2)}</code>
				</pre>
			</CertificationsContentArea>
		</>
	)
}

CertificationsLandingView.layout = BaseNewLayout
export default CertificationsLandingView
