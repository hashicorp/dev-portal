import { ChangeEvent, useRef } from 'react'
import Icon from 'components/icons'
import s from './style.module.css'

interface FilterInputProps {
  value: string
  onChange: (newValue: FilterInputProps['value']) => void
}

const SidebarFilterInput: React.FC<FilterInputProps> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>()
  const showClearButton = value

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleClear = () => {
    onChange('')
    inputRef.current.focus()
  }

  return (
    <div className={s.filterInput}>
      <Icon className={s.filterIcon} name="filter" />
      <input
        onChange={handleChange}
        placeholder="Filter sidebar"
        ref={inputRef}
        value={value}
      />
      {showClearButton && (
        <button
          aria-label="Clear filter"
          className={s.clearButton}
          onClick={handleClear}
        >
          <Icon className={s.clearIcon} name="x" />
        </button>
      )}
    </div>
  )
}

export default SidebarFilterInput
