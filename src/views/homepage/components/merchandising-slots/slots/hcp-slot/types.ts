import { LogoCtaSlotProps } from '../logo-cta-slot/types'

export type HcpSlotProps = Omit<
	LogoCtaSlotProps,
	'backgroundSlot' | 'descriptionMaxWidth' | 'logoSrc'
>
