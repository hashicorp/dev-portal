import { ReactNode } from 'react'

export interface AccordionDisclosureProps {
  children: ReactNode
  description?: string
  id: string
  open?: boolean
  title: string
}
