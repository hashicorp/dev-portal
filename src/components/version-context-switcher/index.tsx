import { ChangeEventHandler, ReactElement, useState } from 'react'
import { IconCaret16 } from '@hashicorp/flight-icons/svg-react/caret-16'
import { useCurrentProduct } from 'contexts'
import { ContextSwitcherOption, VersionContextSwitcherProps } from './types'
import s from './version-context-switcher.module.css'

const VersionContextSwitcher = ({
  initialValue,
  productIcon,
  onChange,
  options,
}: VersionContextSwitcherProps): ReactElement => {
  const currentProduct = useCurrentProduct()
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
      <span className={s.productIcon}>{productIcon}</span>
      <select
        aria-label="Choose a different version to install"
        className={s.select}
        onChange={handleOnChange}
        value={selectedVersion}
      >
        {options.map((option) => (
          <option
            aria-label={`${currentProduct.name} ${option.label}`}
            className={s.option}
            key={option.value}
            value={option.value}
          >
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
