import Image from 'next/image'
import svgHeroImage from './assets/certification-hero-image-outlined.svg'
import StandaloneLink from 'components/standalone-link'
import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import { CertificationsTextAndImageProps } from './types'
import s from './certifications-text-and-image.module.css'

export function CertificationsTextAndImage({
	heading,
	description,
	link,
}: CertificationsTextAndImageProps) {
	return (
		<div className={s.root}>
			<div className={s.heroBackground} />
			<div className={s.textImageLayout}>
				<div className={s.startSlot}>
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
				</div>
				<div className={s.endSlot}>
					<div className={s.heroImage}>
						<Image alt="" src={svgHeroImage} width={447} height={515} />
					</div>
				</div>
			</div>
		</div>
	)
}
