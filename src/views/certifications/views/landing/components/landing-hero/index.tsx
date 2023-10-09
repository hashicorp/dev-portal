/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import {
	CertificationsHero,
	CertificationsHeroText,
} from 'views/certifications/components'
import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image.svg'
import s from './landing-hero.module.css'

function LandingHero({
	heading,
	description,
}: {
	heading: string
	description: string
}) {
	return (
		<CertificationsHero
			backgroundClassName={s.heroBackground}
			startSlot={
				<CertificationsHeroText
					heading={heading}
					description={description}
					foreground="light"
				/>
			}
			endSlot={
				<div className={s.heroImage}>
					<Image alt="" src={svgHeroImage} width={447} height={474} />
				</div>
			}
		/>
	)
}

export { LandingHero }
