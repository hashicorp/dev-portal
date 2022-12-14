import { CertificationsHero } from 'views/certifications/components'
import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image-outlined.svg'
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
			heading={heading}
			description={description}
			foreground="light"
			backgroundSlot={<div className={s.heroBackground} />}
			imageSlot={
				<div className={s.heroImage}>
					<Image alt="" src={svgHeroImage} width={447} height={515} />
				</div>
			}
		/>
	)
}

export { LandingHero }
