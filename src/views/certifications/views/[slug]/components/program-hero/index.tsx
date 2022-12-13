import classNames from 'classnames'
// Shared under certifications
import { CertificationsHero } from 'views/certifications/components'
import { ProgramSlug } from 'views/certifications/types'
// Styles
import s from './program-hero.module.css'

function ProgramHero({
	heading,
	description,
	slug,
}: {
	heading: string
	description: string
	slug: ProgramSlug
}) {
	return (
		<CertificationsHero
			heading={heading}
			description={description}
			foreground={slug === 'security-automation' ? 'dark' : 'light'}
			backgroundSlot={
				<div className={classNames(s.heroBackground, s[`theme-${slug}`])} />
			}
		/>
	)
}

export { ProgramHero }
