import { ReactNode } from 'react'

interface DisclosureProps {
  activatorClassName?: string
  activatorContent: ReactNode
  children: ReactNode
  containerClassName?: string
  contentContainerClassName?: string
}

export type { DisclosureProps }
