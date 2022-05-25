import { ReactNode } from 'react'

interface DisclosureProps {
  activatorClassName?: string
  activatorContent: ReactNode
  children: ReactNode
  containerClassName?: string
  containerCollapsedClassName?: string
  containerExpandedClassName?: string
  contentContainerClassName?: string
  open?: boolean
}

export type { DisclosureProps }
