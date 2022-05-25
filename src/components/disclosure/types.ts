import { ReactNode } from 'react'

interface DisclosureProps {
  children: ReactNode
  containerClassName?: string
  containerCollapsedClassName?: string
  containerExpandedClassName?: string
  open?: boolean
}

export type { DisclosureProps }
