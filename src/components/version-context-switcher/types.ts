import { ChangeEventHandler, ReactElement } from 'react'

/**
 * TODO: this should be moved to exist in a ContextSwitcher component once we
 * build one, it's not been added yet for the sake of time and because it's
 * still a WIP component on the design system side.
 */
export interface ContextSwitcherOption {
  label: string
  value: string
}

export interface VersionContextSwitcherProps {
  initialValue?: ContextSwitcherOption['value']
  leadingIcon: ReactElement
  onChange?: ChangeEventHandler<HTMLSelectElement>
  options: ContextSwitcherOption[]
}
