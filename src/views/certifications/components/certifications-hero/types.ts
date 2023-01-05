import { ReactNode } from 'react'

export interface CertificationsHeroProps {
	heading: string
	description: string
	backgroundSlot?: ReactNode
	imageSlot?: ReactNode
	foreground?: 'dark' | 'light'
}
