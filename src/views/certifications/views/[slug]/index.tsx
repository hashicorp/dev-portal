/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import DevDotContent from 'components/dev-dot-content'
import Heading from '@components/heading'
import Text from '@components/text'
import image from '../../../../../public/img/homepage/waypoint-slot-accent.svg'

// Share certifications
import {
	CertificationsMaxWidth,
	CertificationHero,
	Announcement,
	AccordionWithMdxContent,
} from 'views/certifications/components'
// Local
import {
	CertificationDetails,
	LinkWithImage,
	RelatedCertificationsFooter,
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
		<BaseLayout
			className={s.baseLayout}
			mobileMenuSlot={<MobileMenuLevelsGeneric />}
		>
			<CertificationHero
				eyebrow="Hashicorp certified:"
				heading={hero.heading}
				description={hero.description}
				leftCta={{ text: 'Register for the exam', link: '/certifications' }}
				rightCta={{ text: 'Prepare for the exam', link: '/certifications' }}
			/>
			<div className={s.mainSection}>
				<CertificationsMaxWidth key={slug}>
					<Announcement
						heading={'TechXchange is Coming'}
						text={
							'Learn from certified instructors on how to boost your enterprise adoption of HashiCorp'
						}
						cta={'Read more'}
						ctaLink={'/certifications'}
					/>
					<CertificationDetails product={'terraform'} data={testData} />
					<AccordionWithMdxContent
						className={s.accordionSection}
						items={exams[0].faqItems}
					/>
					<div className={s.renewCertSection}>
						<div className={s.renewCertHeader}>
							<Heading
								className={s.renewCertHeaderTitle}
								level={2}
								size={600}
								weight={'bold'}
							>
								Renew Your Certification
							</Heading>
							<Text
								className={s.renewCertHeaderDesc}
								size={300}
								weight={'regular'}
							>
								Understand your recertification options. Start by finding the
								scenario that applies to you and then evaluate your options.
								Know which exam version you passed by the 3-digit code on your
								credentials (badge and certificate).
							</Text>
						</div>
						{/* <DevDotContent></DevDotContent> */}
					</div>
					<LinkWithImage
						title={'Title - knowledge base for FAQs '}
						description={
							'Donec ullamcorper nulla non metus auctor fringilla. Donec ullamcorper nulla non metus auctor fringilla. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies'
						}
						cta={'Go to knowledge base'}
						ctaLink={'/certifications'}
						image={image}
					/>
				</CertificationsMaxWidth>
				<RelatedCertificationsFooter
					title={'Related Certifications'}
					desc={
						'Body copy, pharetra pellentesque sed elementum risus accumsan et. Tristique tortor, morbi vivamus nibh mollis. Ultrices aliquet sit nibh consequat quam vestibulum ipsum '
					}
					relatedCertifications={[
						{
							product: 'terraform',
							title: 'Terraform Associate',
							ctaLink: '/certifications/terraform-associate',
						},
						{
							product: 'vault',
							title: 'Vault Associate',
							ctaLink: '/certifications/vault-associate',
						},
					]}
				/>
			</div>
		</BaseLayout>
	)
}

export default CertificationProgramView
