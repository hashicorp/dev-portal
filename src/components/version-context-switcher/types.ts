import { ChangeEventHandler, ReactElement } from 'react'

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
