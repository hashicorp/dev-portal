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

function CertificationsLandingView({
	pageContent,
	exams,
}: CertificationLandingProps) {
	const { hero, announcement, certificationPrograms } = pageContent

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
