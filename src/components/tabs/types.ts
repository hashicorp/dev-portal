import { ReactNode } from 'react'

interface BaseProps {
  initialActiveIndex?: number
  tabs: {
    content: ReactNode
    id: string
    label: string
  }[]
}

interface PropsForAriaLabel extends BaseProps {
  ariaLabel: string
  ariaLabelledBy?: never
}

interface PropsForAriaLabelledBy extends BaseProps {
  ariaLabel?: never
  ariaLabelledBy: string
}

export type TabsProps = PropsForAriaLabel | PropsForAriaLabelledBy
