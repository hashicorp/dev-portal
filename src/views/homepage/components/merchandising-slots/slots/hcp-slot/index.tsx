import { LogoCtaSlot } from '../logo-cta-slot'
import logo from '@hashicorp/mktg-logos/product/hcp/primary/black.svg?include'
import { HcpSlotProps } from './types'
import s from './hcp-slot.module.css'

function HcpSlot({ url, cardTitle, description, ctaText }: HcpSlotProps) {
	return (
		<LogoCtaSlot
			url={url}
			cardTitle={cardTitle}
			description={description}
			descriptionMaxWidth="11em"
			ctaText={ctaText}
			logoSrc={logo}
			backgroundSlot={
				<>
					<span className={s.hcpBackground} />
					<span className={s.hcpGraphic} />
				</>
			}
		/>
	)
}

export { HcpSlot }
