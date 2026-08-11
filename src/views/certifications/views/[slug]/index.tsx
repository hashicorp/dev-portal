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
import { MDSCard } from '@components/mds-card'
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
import { findMatchingExams } from '../landing/utils/findMatchingExams'
import { CertificationProgramViewProps } from './types'
import s from './program-view.module.css'

/* 
	A lot of the components have their properties marked as optional -- Why?
	It has to do with Zod's schema checking property: when we mark an zod object as optional, it infers the inner properties to be optional
	This supposedly comes from having strict: false in tsconfig.json?
	Might want to look into it unless we want all our types to have their properties marked as optional
*/
function CertificationProgramView({
	pageContent,
	slug,
	exams,
}: CertificationProgramViewProps) {
	const {
		hero,
		announcement,
		certificationDetails,
		objectives,
		renewCertifications,
		linkWithImage,
		relatedCertsFooter,
		examPageMDXContent,
	} = pageContent

	return (
		<BaseLayout
			className={s.baseLayout}
			mobileMenuSlot={<MobileMenuLevelsGeneric />}
		>
			<CertificationHero
				eyebrow={hero.eyebrow}
				title={hero.title}
				description={hero.description}
				leftCta={hero.leftCta}
				rightCta={hero.rightCta}
			/>
			<div className={s.mainSection}>
				<CertificationsMaxWidth key={slug}>
					<Announcement
						heading={announcement.header}
						text={announcement.text}
						cta={announcement.cta}
						ctaLink={announcement.ctaLink}
					/>
					<CertificationDetails
						product={certificationDetails.product}
						// @ts-ignore schema should match; zod infers every property to be optional
						data={certificationDetails.data}
					/>
					<div className={s.examObjectivesSection}>
						<Heading
							className={s.examObjectivesTitle}
							level={2}
							size={600}
							weight={'bold'}
						>
							{objectives.title}
						</Heading>
						<AccordionWithMdxContent
							disclosureClassName={s.examObjectives}
							items={examPageMDXContent.objectivesItems}
						/>
					</div>
					<div className={s.renewCertSection}>
						<div className={s.renewCertHeader}>
							<Heading
								className={s.renewCertHeaderTitle}
								level={2}
								size={600}
								weight={'bold'}
							>
								{renewCertifications.title}
							</Heading>
							<Text
								className={s.renewCertHeaderDesc}
								size={300}
								weight={'regular'}
							>
								{renewCertifications.description}
							</Text>
						</div>
						<MDSCard className={s.renewCertCard}>
							<DevDotContent
								className={s.renewCertCardContent}
								mdxRemoteProps={{ ...examPageMDXContent.recertificationMdx }}
							/>
						</MDSCard>
					</div>
					<LinkWithImage
						title={linkWithImage.title}
						description={linkWithImage.description}
						cta={linkWithImage.cta}
						ctaLink={linkWithImage.ctaLink}
						image={image}
					/>
				</CertificationsMaxWidth>
				<RelatedCertificationsFooter
					title={relatedCertsFooter.title}
					desc={relatedCertsFooter.description}
					relatedCertifications={findMatchingExams(
						relatedCertsFooter.certs,
						exams,
					)}
				/>
			</div>
		</BaseLayout>
	)
}

export default CertificationProgramView
