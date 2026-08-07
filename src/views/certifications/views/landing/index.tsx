/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Global
import BaseLayout from 'layouts/base-layout'
// Shared components
import MobileMenuLevelsGeneric from 'components/mobile-menu-levels-generic'
import {
	Announcement,
	CertificationsMaxWidth,
	SignupFormArea,
	CertificationCardContainer,
	CertificationHero,
} from 'views/certifications/components'
// Utils
import { findMatchingExams } from './utils/findMatchingExams'
// Local view
import { CertificationLandingProps } from './types'
import s from './landing.module.css'

/* 
	A lot of the components have their properties marked as optional -- Why?
	It has to do with Zod's schema checking property: when we mark an zod object as optional, it infers the inner properties to be optional
	This supposedly comes from having strict: false in tsconfig.json?
	Might want to look into it unless we want all our types to have their properties marked as optional
*/
function CertificationsLandingView({
	pageContent,
	exams,
}: CertificationLandingProps) {
	const { hero, announcement, certificationPrograms } = pageContent

	// another way to do this is to map each certProgram into a CertificationCardContainer
	// currently, this extraction is more explicit
	const terraformCerts = certificationPrograms[0]
	const vaultCerts = certificationPrograms[1]

	return (
		<BaseLayout mobileMenuSlot={<MobileMenuLevelsGeneric />}>
			<div className={s.root}>
				<CertificationHero title={hero.title} description={hero.description} />
				<CertificationsMaxWidth>
					<Announcement
						heading={announcement.heading}
						text={announcement.text}
						cta={announcement.cta}
						ctaLink={announcement.ctaLink}
					/>
					<CertificationCardContainer
						product={terraformCerts.product}
						containerDesc={terraformCerts.containerDescription}
						certs={findMatchingExams(terraformCerts.certs, exams)}
					/>
					<CertificationCardContainer
						product={vaultCerts.product}
						containerDesc={vaultCerts.containerDescription}
						certs={findMatchingExams(vaultCerts.certs, exams)}
					/>
					<div className={s.signupForm}>
						<SignupFormArea />
					</div>
				</CertificationsMaxWidth>
			</div>
		</BaseLayout>
	)
}

export default CertificationsLandingView
