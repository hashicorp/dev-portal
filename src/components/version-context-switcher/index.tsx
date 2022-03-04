import { ChangeEventHandler, ReactElement, useState } from 'react'
import s from './version-context-switcher.module.css'

interface ContextSwitcherOption {
  label: string
  value: string
}

interface VersionContextSwitcherProps {
  initialValue?: ContextSwitcherOption['value']
  onChange?: ChangeEventHandler<HTMLSelectElement>
  options: ContextSwitcherOption[]
}

const VersionContextSwitcher = ({
  initialValue,
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
    <>
      <select
        className={s.root}
        onChange={handleOnChange}
        value={selectedVersion}
      >
        {options.map((option) => (
          <option className={s.option} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default VersionContextSwitcher
