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
	CertificationHero,
} from 'views/certifications/components'
// Local
import {
	ExamDetailsCard,
	HeadingPermalink,
	LinkWithImage,
	CertificationDetails,
} from './components'
import { CertificationProgramViewProps } from './types'
import s from './program-view.module.css'

function CertificationProgramView({
	pageContent,
	slug,
}: CertificationProgramViewProps) {
	const { hero, exams } = pageContent

	const testData = {
		whoShouldTakeExam: {
			title: 'Who should take this exam',
			desc: 'You should take the Terraform Authoring and Operations Professional exam if you have advanced production-level Terraform expertise in both configuration authoring and Terraform workflows. You will need to demonstrate your professional-level skills implementing and authoring Terraform modules, developing dynamic HCL configuration, and establishing scalable, collaborative workflows.',
		},
		examDetails: {
			title: 'Exam Details',
			details: [
				{
					name: 'Assessment Type',
					value: 'Multiple choice',
				},
				{ name: 'Format', value: 'Online Proctored' },
				{ name: 'Credential Expiration', value: '2 years' },
				{ name: 'Language', value: 'English' },
				{
					name: 'Duration',
					value: '1 hour',
				},
				{
					name: 'Price',
					value:
						'$70.50 USD, plus locally applicable taxes and fees. Free retake not included.',
				},
				{
					name: 'Keyboard',
					value:
						'US QWERTY only (contact certifications@hashicorp.com for other languages or layouts)',
				},
			],
		},
		prerequisites: {
			title: 'Prerequisites',
			prereqs: [
				'Terraform Associate certification (strongly recommend, or equivalent experience required)',
				'Linux skills, such as the ability to list and edit files via command terminal',
				'Linux skills, such as the ability to list and edit files via command terminal',
				'Experience using cloud credentials',
				'Familiarity with YAML, JSON, HCL, and CSV formats',
				'Understanding of the networking stack and networking protocols, including TCP/IP and UDP',
				'Advanced configuration authoring and a deep understanding of Terraform workflows',
			],
			bottomDesc:
				'While professional experience is recommended, you can also prepare by practicing the exam objectives in a personal demo setup.',
		},
	}

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<CertificationHero
				eyebrow="Hashicorp certified:"
				heading={hero.heading}
				description={hero.description}
				leftCta={{ text: 'Register for the exam', link: '/certifications' }}
				rightCta={{ text: 'Prepare for the exam', link: '/certifications' }}
			/>
			<div className={s.mainSection}>
				<CertificationsMaxWidth key={slug}>
					<CertificationDetails product={'terraform'} data={testData} />
					{/* <div className={s.examsSection}>
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
					</div> */}
					{/* <div className={s.signupForm}>
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
					</div> */}
				</CertificationsMaxWidth>
			</div>
		</BaseLayout>
	)
}

export default CertificationProgramView
