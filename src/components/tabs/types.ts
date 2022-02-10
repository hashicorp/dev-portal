import { ReactNode } from 'react'

interface BaseProps {
  children: ReactNode
  initialActiveIndex?: number
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
