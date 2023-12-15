/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import classNames from 'classnames'
// Shared under certifications
import { ProgramSlug } from 'views/certifications/types'
// Local
import { ProgramHeroProps, HeroProps } from './types'
// Styles
import s from './program-hero.module.css'
import StandaloneLink from 'components/standalone-link'
import { IconArrowLeft16 } from '@hashicorp/flight-icons/svg-react/arrow-left-16'
import { Hero, HeroText } from 'components/landing-hero/components/hero'

/**
 * Note: foreground and background are both set based on the program `slug`.
 * When new programs are added, this enum and the `theme-` classes in the
 * adjacent `program-hero.module.css` should likely be expanded.
 *
 * If a slug is not explicitly supported, the CertificationsHero will default
 * to dark foreground text, and a plain white background.
 */
const programHeroForeground: Record<ProgramSlug, HeroProps['foreground']> = {
	'security-automation': 'dark',
	'infrastructure-automation': 'light',
	'networking-automation': 'light',
}

/**
 * Render a styled hero for an individual program page.
 */
function ProgramHero({ heading, description, slug }: ProgramHeroProps) {
	const foreground = programHeroForeground[slug]
	return (
		<Hero
			backgroundClassName={classNames(s.heroBackground, s[`theme-${slug}`])}
			startSlot={
				<>
					<StandaloneLink
						className={classNames(
							s.allCertificationsLink,
							s[`foreground-${foreground}`]
						)}
						href="/certifications"
						text="All Certifications"
						icon={<IconArrowLeft16 />}
						iconPosition={'leading'}
						color="secondary"
					/>
					<HeroText
						heading={heading}
						description={description}
						foreground={foreground}
					/>
				</>
			}
		/>
	)
}

export { ProgramHero }
