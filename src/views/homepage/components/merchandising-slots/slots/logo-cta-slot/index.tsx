import InlineSvg from '@hashicorp/react-inline-svg'

import { IconArrowRight16 } from '@hashicorp/flight-icons/svg-react/arrow-right-16'
import CardLink from 'components/card-link'
import { LogoCtaSlotProps } from './types'
import s from './logo-cta-slot.module.css'
import { CSSProperties } from 'react'

function LogoCtaSlot({
	backgroundSlot,
	cardTitle,
	ctaText,
	description,
	logoSrc,
	url,
	descriptionMaxWidth = '14em',
}: LogoCtaSlotProps) {
	return (
		<CardLink ariaLabel={cardTitle} href={url} className={s.root}>
			{backgroundSlot}
			<InlineSvg className={s.logo} src={logoSrc} />
			<p
				className={s.description}
				style={
					{ '--description-max-width': descriptionMaxWidth } as CSSProperties
				}
			>
				{description}
			</p>
			<p className={s.cta}>
				{ctaText} <IconArrowRight16 />
			</p>
		</CardLink>
	)
}

export { LogoCtaSlot }
