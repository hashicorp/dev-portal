import { ReactNode } from 'react'

/**
 * TODO: We more than likely want to require an accessible label on Tabs in the
 * future, but we do not currently require it on our existing Tabs from
 * react-components. For migration purposes, labels are not currently marked as
 * required.
 *
 * The commented out code below this `TabsProps` interface is how we would
 * accomplish requiring either `aria-label` or `aria-labelledby`.
 */
export interface TabsProps {
  ariaLabel?: string
  ariaLabelledBy?: string
  children: ReactNode
  initialActiveIndex?: number
  showAnchorLine?: boolean
}

// interface BaseProps {
//   children: ReactNode
//   initialActiveIndex?: number
// }

// interface PropsForAriaLabel extends BaseProps {
//   ariaLabel: string
//   ariaLabelledBy?: never
// }

// interface PropsForAriaLabelledBy extends BaseProps {
//   ariaLabel?: never
//   ariaLabelledBy: string
// }

// export type TabsProps = PropsForAriaLabel | PropsForAriaLabelledBy
