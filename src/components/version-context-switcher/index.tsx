import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { ChangeEventHandler, ReactElement, useState } from 'react'
import { ContextSwitcherOption, VersionContextSwitcherProps } from './types'
import s from './version-context-switcher.module.css'

const VersionContextSwitcher = ({
  initialValue,
  leadingIcon,
  onChange,
  options,
}: VersionContextSwitcherProps): ReactElement => {
  const [selectedVersion, setSelectedVersion] = useState<
    ContextSwitcherOption['value']
  >(initialValue || options[0].value)

  const handleOnChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedVersion(e.target.value)

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={s.root}>
      <span className={s.leadingIcon}>{leadingIcon}</span>
      <select
        className={s.select}
        onChange={handleOnChange}
        value={selectedVersion}
      >
        {options.map((option) => (
          <option className={s.option} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={s.trailingIcon}>
        <IconCaret16 />
      </span>
    </div>
  )
}

export type { ContextSwitcherOption, VersionContextSwitcherProps }
export default VersionContextSwitcher
