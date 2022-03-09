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
  /**
   * (optional) The initial value of the switcher when first rendered.
   */
  initialValue?: ContextSwitcherOption['value']

  /**
   * The icon to render on the left side of the switcher.
   */
  leadingIcon: ReactElement

  /**
   * (optional) A function invoked when the value of the switcher has changed.
   * It is invoked after the component has run its internal code for handling
   * changes to the switcher.
   */
  onChange?: ChangeEventHandler<HTMLSelectElement>

  /**
   * An array of the options to render in the switcher.
   */
  options: ContextSwitcherOption[]
}
