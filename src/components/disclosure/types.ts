import { ReactNode } from 'react'

export interface DisclosureProps {
  children: ReactNode
  description?: string
  id: string
  open?: boolean
  title: string
}
