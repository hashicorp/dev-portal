import classNames from 'classnames'
// Shared under certifications
import {
	CertificationsHero,
	CertificationsHeroProps,
} from 'views/certifications/components'
import { ProgramSlug } from 'views/certifications/types'
// Local
import { ProgramHeroProps } from './types'
// Styles
import s from './program-hero.module.css'

/**
 * Note: foreground and background are both set based on the program `slug`.
 * When new programs are added, this enum and the `theme-` classes in the
 * adjacent `program-hero.module.css` should likely be expanded.
 *
 * If a slug is not explicitly supported, the CertificationsHero will default
 * to dark foreground text, and a plain white background.
 */
const programHeroForeground: Record<
	ProgramSlug,
	CertificationsHeroProps['foreground']
> = {
	'security-automation': 'dark',
	'infrastructure-automation': 'light',
	'networking-automation': 'light',
}

function ProgramHero({ heading, description, slug }: ProgramHeroProps) {
	return (
		<CertificationsHero
			heading={heading}
			description={description}
			foreground={programHeroForeground[slug]}
			backgroundSlot={
				<div className={classNames(s.heroBackground, s[`theme-${slug}`])} />
			}
		/>
	)
}

export { ProgramHero }
