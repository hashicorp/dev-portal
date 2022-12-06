import BaseNewLayout from 'layouts/base-new'
import { CertificationLandingProps } from './types'
import {
	CertificationsContentArea,
	CertificationsHero,
	CertificationsNav,
} from '../components'
import {
	CertificationProgramSection,
	OverviewAndFaq,
	SignupFormArea,
} from './components'
function CertificationsLandingView({
	navProps,
	pageContent,
}: CertificationLandingProps) {
	return (
		<>
			<CertificationsNav {...navProps} />
			<CertificationsHero
				heading="HashiCorp Cloud Engineer Certifications"
				description="Each certification program tests both conceptual knowledge and real-world experience using HashiCorp multi-cloud tools. Upon passing the exam, you can easily communicate your proficiency and employers can quickly verify your results."
			/>
			<div style={{ isolation: 'isolate' }}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '24px',
						alignItems: 'stretch',
						zIndex: 1,
					}}
				>
					<CertificationProgramSection
						heading="Infrastructure Automation headline"
						description="Brief intro- short but enough to help practicioners take that next step. Suggestion is a max of 5 lines of content. Verify your basic infrastructure automation skills. If you have passed the Terraform Assocate wait until the new version comes out to recertify."
						overviewCta={{
							text: 'Overview',
							url: '/certifications/infrastructure-automation',
						}}
						certifications={[
							{
								title: 'Terraform Associate 002',
								url: '/terraform/tutorials/certification',
							},
							{
								title: 'Terraform Associate 003',
							},
						]}
					/>
					<CertificationProgramSection
						heading="Security Automation headline"
						description="Brief intro- short but enough to help practicioners take that next step. Suggestion is a max of 5 lines of content. Verify your basic security automation skills. Prerequisites include; basic terminal skills, understanding of on premise or cloud architecture."
						overviewCta={{
							text: 'Overview',
							url: '/certifications/security-automation',
						}}
						certifications={[
							{
								title: 'Vault Associate 002',
								url: '/vault/tutorials/associate-cert/associate-study',
							},
							{
								title: 'Vault Operations Professional',
								url: '/vault/tutorials/ops-pro-cert',
							},
						]}
					/>
					<CertificationProgramSection
						heading="Networking Automation headline"
						description="Brief intro- short but enough to help practicioners take that next step. Suggestion is a max of 5 lines of content. Verify your basic networking automation skills. Prerequisites include; containerization knowledge,  load balancing, and distributed systems."
						overviewCta={{
							text: 'Overview',
							url: '/certifications/networking-automation',
						}}
						certifications={[
							{
								title: 'Consul Associate 002',
								url: '/consul/tutorials/certification',
							},
						]}
					/>
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
				<h2>{`[stub]`} Page Content</h2>
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
