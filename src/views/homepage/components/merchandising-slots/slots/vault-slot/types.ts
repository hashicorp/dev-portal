import { LogoCtaSlotProps } from '../logo-cta-slot/types'

export type VaultSlotProps = Omit<
	LogoCtaSlotProps,
	'backgroundSlot' | 'descriptionMaxWidth' | 'logoSrc'
>
