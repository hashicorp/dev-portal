import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image-outlined.svg'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { CertificationsTextAndImageProps } from './types'
import { SplitLayoutWithBackground } from '../split-layout-with-background'
import s from './certifications-text-and-image.module.css'

/**
 * Render a heading, description, and link with a certifications-themed
 * background and accompanying presentation visual.
 */
export function CertificationsTextAndImage({
	heading,
	description,
	link,
}: CertificationsTextAndImageProps) {
	return (
		<SplitLayoutWithBackground
			paddingClass={s.paddingClass}
			backgroundClass={s.heroBackground}
			startSlot={
				<>
					<h2 className={s.heading}>{heading}</h2>
					<p className={s.description}>{description}</p>
					<StandaloneLink
						className={s.standaloneLink}
						href={link.url}
						text={link.text}
						icon={<IconArrowRight16 />}
						iconPosition="trailing"
						color="secondary"
					/>
				</>
			}
			endSlot={
				<div className={s.heroImage}>
					<Image alt="" src={svgHeroImage} width={447} height={515} />
				</div>
			}
		/>
	)
}
