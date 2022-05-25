import { ReactNode } from 'react'

interface DisclosureProps {
  activatorClassName?: string
  activatorContent: ReactNode
  ariaLabel?: JSX.IntrinsicElements['button']['aria-label']
  children: ReactNode
  containerClassName?: string
  containerCollapsedClassName?: string
  containerExpandedClassName?: string
  contentContainerClassName?: string
  open?: boolean
}

export type { DisclosureProps }
