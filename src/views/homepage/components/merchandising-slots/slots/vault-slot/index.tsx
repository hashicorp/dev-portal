import { LogoCtaSlot } from '../logo-cta-slot'
import logo from '@hashicorp/mktg-logos/product/vault/primary/color.svg?include'
import { VaultSlotProps } from './types'
import s from './vault-slot.module.css'

function VaultSlot({ url, cardTitle, description, ctaText }: VaultSlotProps) {
	return (
		<LogoCtaSlot
			url={url}
			cardTitle={cardTitle}
			description={description}
			ctaText={ctaText}
			logoSrc={logo}
			backgroundSlot={<span className={s.vaultBackground} />}
		/>
	)
}

export { VaultSlot }
