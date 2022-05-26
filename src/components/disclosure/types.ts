import { ReactElement } from 'react'

interface DisclosureProps {
  children: ReactElement[]
  containerClassName?: string
  containerCollapsedClassName?: string
  containerExpandedClassName?: string
  open?: boolean
}

export type { DisclosureProps }
